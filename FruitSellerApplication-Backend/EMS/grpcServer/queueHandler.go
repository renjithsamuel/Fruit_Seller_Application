package grpcServer

import (
	eventProto "FruitSellerApplicationEMS/Proto/eventProto"
	"FruitSellerApplicationEMS/domain"
	"FruitSellerApplicationEMS/model"
	"log"
	"sync"
	"time"
)

type Queue interface {
	SendAllFailedEvents()
	SendFailedEventsFor(subscriber string)
	SendEvent(subscriber string, event model.EventResponse)
	// checks for failed events constantly for specified time period and if no failed events are captured it may stop
	CheckForFailedEvents(Frequency time.Duration)
	StopCheckingForFailedEvents()
}

type QueueHandler struct {
	ActiveSubscribersStream *map[string]eventProto.EventService_SubscribeServer // active subscriber vs stream object
	ActiveSubscribers       *map[string]stringArray                             // topic vs active subscribers
	domain                  domain.Service
	ticker                  *time.Ticker
	stop                    chan bool
	isRunning               bool
	mutex                   *sync.Mutex
}

func NewQueueHandler(domain domain.Service) *QueueHandler {
	return &QueueHandler{
		domain:                  domain,
		ActiveSubscribersStream: &map[string]eventProto.EventService_SubscribeServer{},
		ActiveSubscribers:       &map[string]stringArray{},
		mutex:                   &sync.Mutex{},
		ticker:                  nil,
		stop:                    make(chan bool),
		isRunning:               false,
	}
}

func (q *QueueHandler) CheckForFailedEvents(Frequency time.Duration) {
	if q.isRunning {
		q.stop <- true
	}
	q.ticker = time.NewTicker(Frequency * time.Minute)
	q.isRunning = true

	go func() {
		for {
			select {
			case <-q.ticker.C:
				q.SendAllFailedEvents()
				events, err := q.domain.GetAllEvents()
				if err != nil {
					log.Printf("Error while fetching events %v \n", err)
					return
				}

				if len(events) == 0 {
					q.stop <- true
				}
			case <-q.stop:
				q.isRunning = false
				return

			}
		}
	}()
}

func (q *QueueHandler) StopCheckingForFailedEvents() {
	q.stop <- true
}

func (q *QueueHandler) SendAllFailedEvents() {
	events, err := q.domain.GetAllEvents()
	if err != nil {
		log.Printf("Error while fetching events %v \n", err)
		return
	}

	for _, event := range events {
		subscribers := (*q.ActiveSubscribers)[event.Topic]
		for _, subscriber := range subscribers {
			q.SendEvent(subscriber, []model.EventResponse{event})
		}
	}
}

func (q *QueueHandler) SendFailedEventsFor(subscriber string) {
	if len(subscriber) == 0 {
		log.Println("Error With subscriber name")
		return
	}
	events, err := q.domain.GetEvents(subscriber)
	if err != nil {
		log.Println("Error while fetching events")
		return
	}
	q.SendEvent(subscriber, events)
}

func (q *QueueHandler) SendEvent(subscriber string, events []model.EventResponse) {
	stream := (*q.ActiveSubscribersStream)[subscriber]
	for _, event := range events {
		err := stream.SendMsg(&eventProto.StreamData{
			Topic:   event.Topic,
			Payload: event.Payload,
		})
		if err == nil {
			q.domain.RemoveEvent(event.EventID)
		} else {
			log.Println("subscriber resending err", err)
		}
	}
}
