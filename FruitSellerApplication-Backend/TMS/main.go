package main

import (
	"FruitSellerApplicationTMS/grpcServer"
	"flag"
	"fmt"
	"github.com/joho/godotenv"
	"log"
	"os"
	"os/signal"
	"time"
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
	flag.StringVar(&port, "port", ":50021", "server port")
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

func main() {
	setBuildVariables()
	parseFlags()

	go handleInterrupts()

	// Getting secret key
	if err := godotenv.Load(); err != nil {
		panic(err)
	}
	secretKey := os.Getenv("JWT_SECRET_KEY")

	go func() {
		errc <- grpcServer.RunGrpcServer(port, secretKey)
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
