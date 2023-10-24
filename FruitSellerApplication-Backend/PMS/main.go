package main

import (
	"FruitSellerApplicationPMS/domain"
	"FruitSellerApplicationPMS/grpcClient"
	"FruitSellerApplicationPMS/grpcServer"
	"FruitSellerApplicationPMS/handler"
	"FruitSellerApplicationPMS/middleware"
	"FruitSellerApplicationPMS/routes"
	"database/sql"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

var (
	buildVersion  string
	buildRevision string
	buildTime     string

	helpFlag    bool
	versionFlag bool

	port string

	done      = make(chan struct{})
	errc      = make(chan error)
	doneRetry = make(chan bool)
)

func init() {
	flag.BoolVar(&helpFlag, "help", false, "show usage and exit")
	flag.BoolVar(&versionFlag, "version", false, "show version and exit")
	flag.StringVar(&port, "port", ":5004", "server port")
}

func setBuildVariables() {
	if buildRevision == "" {
		buildRevision = "dev"
	}

	if buildVersion == "" {
		buildVersion = "dev"
	}

	if buildTime == "" {
		buildTime = time.Now().UTC().Format(time.RFC3339)
	}
}

func parseFlags() {
	flag.Parse()

	if helpFlag {
		flag.Usage()
		os.Exit(0)
	}

	if versionFlag {
		fmt.Printf("%s %s %s \n", buildRevision, buildVersion, buildTime)
		os.Exit(0)
	}
}

func handleInterrupts() {
	log.Println("handling interrupts")

	interrupts := make(chan os.Signal, 1)
	signal.Notify(interrupts, os.Interrupt)

	sig := <-interrupts
	log.Printf("caught sig: %v", sig)

	done <- struct{}{}
}

func openDB() (*sql.DB, error) {
	var (
		host     = "localhost"
		username = "postgres"
		password = "postgres"
		port     = 5432
		dbname   = "fruit_seller_application_pms"
	)

	// if err := godotenv.Load(); err != nil {
	// 	return nil, err
	// }

	psqlInfo := os.Getenv("POSTGRESSQL_CONN_STRING")
	if len(psqlInfo) == 0 {
		psqlInfo = fmt.Sprintf("host=%v username=%v password=%v port=%v dbname=%v", host, username, password, port, dbname)
	}
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, err
	}
	return db, nil
}

func main() {
	parseFlags()
	setBuildVariables()
	go handleInterrupts()

	server := gin.Default()
	// initializing cors
	server.Use(middleware.CORSMiddleware())

	psqlInfo, err := openDB()

	if err != nil {
		log.Fatalf("Failed connection to DB : %v", err)
	}

	fmt.Println("Connected to DB")

	defer psqlInfo.Close()

	productService := domain.NewProductService(psqlInfo)

	authClient, err := grpcClient.NewTokenServiceClient()
	if err != nil {
		errc <- err
	}
	defer authClient.Close()

	middleware := middleware.NewMiddleware(authClient)

	productHandler := handler.NewProductHanlder(productService)

	apiRoutes := routes.NewProductRoutes(productHandler)
	routes.AttachProductRoutes(server, apiRoutes, middleware)

	go func() {
		errc <- grpcServer.RunGrpcServer(":50041", productService)
	}()

	go func() {
		errc <- server.Run(port)
	}()

	select {
	case <-errc:
		log.Printf("Listen And Serve Error:%v", errc)
	case <-done:
		log.Println("Shutting down server gracefully....")
	}

	time.AfterFunc(1*time.Second, func() {
		close(done)
		close(doneRetry)
		close(errc)
	})

}
