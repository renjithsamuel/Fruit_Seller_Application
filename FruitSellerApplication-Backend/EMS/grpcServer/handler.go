package grpcServer

import (
	eventProto "FruitSellerApplicationEMS/Proto/eventProto"
	"FruitSellerApplicationEMS/workerpool"
	"context"
)

type Handler interface {
	Publish(ctx context.Context, req *eventProto.PublishRequest) (*eventProto.EventResponse, error)
	Subscribe(req *eventProto.SubscribeRequest, stream eventProto.EventService_SubscribeServer) error
}

type EventHandler struct {
	Handler
	queueHandler *QueueHandler
	workerpool   *workerpool.Workerpool
	eventProto.UnimplementedEventServiceServer
}

func NewEventHandler(queueHandler *QueueHandler, workerpool *workerpool.Workerpool) *EventHandler {
	return &EventHandler{
		queueHandler: queueHandler,
		workerpool:   workerpool,
	}
}

type stringArray []string

func (ar *stringArray) Find(value string) bool {
	for _, element := range *ar {
		if element == value {
			return true
		}
	}
	return false
}

func (ar *stringArray) Add(value string) {
	*ar = append(*ar, value)
}
