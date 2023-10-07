package grpcServer

import (
	eventProto "FruitSellerApplicationEMS/Proto/eventProto"
	"log"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (h *EventHandler) Subscribe(req *eventProto.SubscribeRequest, stream eventProto.EventService_SubscribeServer) error {
	pubSub, ok := PubSubList[req.Topic]

	if !ok {
		log.Println("Requested topic invalid")
		return status.Errorf(codes.NotFound, "Topic %s not found", req.Topic)
	}

	if !Authenticate(pubSub.Subscribers, req.AppID) {
		log.Println("You are not authorized to subscribe to this topic", req.Topic)
		return status.Errorf(codes.PermissionDenied, "Unauthorized subscriber for topic %s", req.Topic)
	}

	h.workerpool.AddJob(NewSubscribeWork(h.queueHandler, req.Topic, req.AppID, stream))

	log.Println("New Subscriber: ", req.AppID, " ,Added to the topic: ", req.Topic)
	select {
	case <-stream.Context().Done():
		return stream.Context().Err()
	}
}

// map topic -> publisher and subscribers
type PubSub struct {
	Publishers  []string
	Subscribers []string
}

// app ID should be done in runtime
var PubSubList = map[string]PubSub{
	"user_created": {
		Publishers:  []string{"UMS"},
		Subscribers: []string{"CMS"},
	},
	"cart_created": {
		Publishers:  []string{"CMS"},
		Subscribers: []string{"UMS"},
	},
}

func Authenticate(slice []string, str string) bool {
	for _, s := range slice {
		if s == str {
			return true
		}
	}
	return false
}
