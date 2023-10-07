package grpcServer

import (
	eventProto "FruitSellerApplicationEMS/Proto/eventProto"
	"context"
	"log"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (h *EventHandler) Publish(ctx context.Context, req *eventProto.PublishRequest) (*eventProto.EventResponse, error) {
	pubSub, ok := PubSubList[req.Topic]
	if !ok {
		log.Println("Requested topic invalid")
		return nil, status.Errorf(codes.NotFound, "Topic %s not found", req.Topic)
	}

	log.Println("pubsub", pubSub, " app ID", req.AppID)

	if !Authenticate(pubSub.Publishers, req.AppID) {
		log.Println("You are not authorized to publish to this topic", req.Topic)
		return nil, status.Errorf(codes.PermissionDenied, "Unauthorized publisher for topic %s", req.Topic)
	}

	publishWork := NewPublishWork(h.queueHandler, req.Topic, req.Payload, req.AppID, pubSub)
	h.workerpool.AddJob(publishWork)

	return &eventProto.EventResponse{
		Message: "Event published successfully",
		Success: true,
	}, nil

}
