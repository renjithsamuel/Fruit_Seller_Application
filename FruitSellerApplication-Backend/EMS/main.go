package main

import (
	eventProto "FruitSellerApplicationEMS/Proto/eventProto"
	"FruitSellerApplicationEMS/domain"
	"FruitSellerApplicationEMS/grpcServer"
	"FruitSellerApplicationEMS/workerpool"
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net"
	"os"
	"os/signal"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"google.golang.org/grpc"
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
	flag.StringVar(&port, "port", ":50051", "server port")
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
		dbname   = "fruit_seller_application_cms"
	)

	if err := godotenv.Load(); err != nil {
		panic(err)
	}

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

	psqlInfo, err := openDB()
	if err != nil {
		log.Printf("error connecting to DB: %v", err)
		return
	}
	log.Println("Connection to DB success!")
	defer psqlInfo.Close()

	workerpool := workerpool.NewWorkerPool(2, 5)

	domainService := domain.NewEventService(psqlInfo)

	queueHandler := grpcServer.NewQueueHandler(domainService)

	grpcEventHandler := grpcServer.NewEventHandler(queueHandler, workerpool)

	queueHandler.CheckForFailedEvents(10)

	listener, err := net.Listen("tcp", port)
	if err != nil {
		log.Printf("Failed to listen: %v", err)
		return
	}

	grpcServer := grpc.NewServer()
	eventProto.RegisterEventServiceServer(grpcServer, grpcEventHandler)

	fmt.Println("EMS gRPC server is running on port ", port, "...")
	go func() {
		errc <- grpcServer.Serve(listener)
	}()

	select {
	case <-errc:
		log.Printf("Listen and serve error: %v", err)
	case <-done:
		log.Println("Shutting down server...")
	}

	time.AfterFunc(1*time.Second, func() {
		close(done)
		close(doneRetry)
		close(errc)
	})
}
