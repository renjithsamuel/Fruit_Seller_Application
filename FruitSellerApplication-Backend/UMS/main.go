package main

import (
	"FruitSellerApplicationUMS/domain"
	"FruitSellerApplicationUMS/grpcClient"
	"FruitSellerApplicationUMS/handlers"
	"FruitSellerApplicationUMS/middleware"
	"FruitSellerApplicationUMS/routes"
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
	// version flags
	buildRevision string
	buildVersion  string
	buildTime     string

	// general options
	versionFlag bool
	helpFlag    bool

	// server port
	port string

	// program controller
	done      = make(chan struct{})
	doneRetry = make(chan bool)
	errc      = make(chan error)
)

func init() {
	flag.BoolVar(&versionFlag, "version", false, "show current version and exit")
	flag.BoolVar(&helpFlag, "help", false, "show usage and exit")
	flag.StringVar(&port, "port", ":5001", "server port")
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
		fmt.Printf("%s %s %s\n", buildRevision, buildVersion, buildTime)
		os.Exit(0)
	}
}

func handleInterrupts() {
	log.Println("Start handle inturrupts")
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)

	sig := <-interrupt
	log.Printf("caught sig : %v", sig)

	done <- struct{}{}
}

func openDB() (*sql.DB, error) {
	var (
		host     = "localhost"
		port     = 5432
		username = "postgres"
		password = "postgres"
		dbname   = "fruit_seller_application_ums"
	)

	// if err := godotenv.Load(); err != nil {
	// 	return nil, err
	// }

	psqlInfo := os.Getenv("POSTGRESSQL_CONN_STRING")
	if len(psqlInfo) == 0 {
		psqlInfo = fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, username, password, dbname)
	}
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, err
	}
	return db, nil
}

func main() {
	setBuildVariables()
	parseFlags()

	go handleInterrupts()

	server := gin.Default()
	// initializing cors
	server.Use(middleware.CORSMiddleware())

	psqlInfo, err := openDB()
	if err != nil {
		log.Fatalf("error connecting to DB : %v", err)
	}
	log.Println("Connection to DB success!")
	defer psqlInfo.Close()

	userService := domain.NewUserService(psqlInfo)
	// initializing GrpcClients
	authClient, err := grpcClient.NewTokenServiceClient()
	if err != nil {
		errc <- err
	}
	defer authClient.CloseTokenClient()
	cartClient, err := grpcClient.NewCartServiceClient()
	if err != nil {
		errc <- err
	}
	defer cartClient.CloseCartClient()

	var eventClient *grpcClient.EventServiceClient
	// go func() {
	eventClient, err = grpcClient.NewEventServiceClient(userService)
	if err != nil {
		log.Println("authClient Error:", err)
		// return
	}
	// 	if err := eventClient.SubscribeToCartCreated(); err != nil {
	// 		log.Println("Event Client Error:", err)
	// 		retrySubscription(eventClient)
	// 	}
	// }()
	defer eventClient.CloseEventClient()

	userHandler := handlers.NewUserHandler(userService, eventClient, cartClient, authClient)
	middleware := middleware.NewAuthMiddleware(authClient)
	apiRoutes := routes.NewRoutes(userHandler)
	routes.AttactRoutes(server, apiRoutes, middleware)

	go func() {
		errc <- server.Run(port)
	}()

	go func() {
		if err := eventClient.SubscribeToCartCreated(); err != nil {
			log.Println("Grpc Client Error:", err)
		}
	}()

	select {
	case err := <-errc:
		log.Printf("Listen and serve error : %v", err)
	case <-done:
		log.Println("Shutting down server...")
	}

	time.AfterFunc(1*time.Second, func() {
		close(done)
		close(doneRetry)
		close(errc)
	})
}

func retrySubscription(eventClient *grpcClient.EventServiceClient) {
	for {
		select {
		case <-done:
			log.Println("[retryEventServiceConnection] Stopping")
			return
		default:
			log.Println("[retryEventServiceConnection] Started connecting with event subscriber")

			err := eventClient.SubscribeToCartCreated()
			if err != nil {
				log.Println("[retryEventServiceConnection] Unable to subscribe to events. Retrying in 5 seconds.")
				time.Sleep(5 * time.Second)
				continue
			}

			log.Println("[retryEventServiceConnection] Connected to EMS")
			return
		}
	}
}
