package grpcServer

import (
	eventProto "FruitSellerApplicationEMS/Proto/eventProto"
	"fmt"
	"log"
	"sync"
)

type PublishWork struct {
	queueHandler *QueueHandler
	topic        string
	publisher    string
	payload      []byte
	wg           *sync.WaitGroup
	PubSub       PubSub
}

var publishWg = &sync.WaitGroup{}

func NewPublishWork(queueHandler *QueueHandler, topic string, payload []byte, publisher string, PubSub PubSub) *PublishWork {
	publishWg.Add(1)
	return &PublishWork{
		queueHandler: queueHandler,
		topic:        topic,
		payload:      payload,
		publisher:    publisher,
		wg:           publishWg,
		PubSub:       PubSub,
	}
}

func (pw *PublishWork) Do() {
	defer pw.wg.Done()
	subscriberArray := (*pw.queueHandler.ActiveSubscribers)[pw.topic]

	for _, subscriber := range pw.PubSub.Subscribers {

		if !subscriberArray.Find(subscriber) {
			pw.StoreEvent(subscriber)
			continue
		}
		err := (*pw.queueHandler.ActiveSubscribersStream)[subscriber].Send(&eventProto.StreamData{
			Topic:   pw.topic,
			Payload: pw.payload,
		})

		if err != nil {
			log.Println("Error while sending message to subscriber", subscriber)
			pw.StoreEvent(subscriber)
			pw.queueHandler.CheckForFailedEvents(10)
		}
	}
}

func (pw *PublishWork) StoreEvent(Subscriber string) {
	storeEvent := &eventProto.PublishRequest{
		Topic:   pw.topic,
		Payload: pw.payload,
		AppID:   Subscriber,
	}
	if err := pw.queueHandler.domain.AddEvent(storeEvent); err != nil {
		fmt.Println("failed to store the event!", err)
	}
}
