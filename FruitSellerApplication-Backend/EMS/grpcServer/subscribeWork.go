package grpcServer

import eventProto "FruitSellerApplicationEMS/Proto/eventProto"

type SubscribeWork struct {
	queueHandler *QueueHandler
	topic        string
	subscriber   string
	stream       eventProto.EventService_SubscribeServer
}

func NewSubscribeWork(queueHandler *QueueHandler, topic string, subscriber string, stream eventProto.EventService_SubscribeServer) *SubscribeWork {
	return &SubscribeWork{
		queueHandler: queueHandler,
		topic:        topic,
		subscriber:   subscriber,
		stream:       stream,
	}
}

func (sw *SubscribeWork) Do() {
	sw.queueHandler.mutex.Lock()
	subscriberArray, ok := (*sw.queueHandler.ActiveSubscribers)[sw.topic]
	if !ok {
		(*sw.queueHandler.ActiveSubscribers)[sw.topic] = stringArray{}
	}

	if !subscriberArray.Find(sw.subscriber) {
		subscriberArray.Add(sw.subscriber)
	}

	(*sw.queueHandler.ActiveSubscribers)[sw.topic] = subscriberArray
	(*sw.queueHandler.ActiveSubscribersStream)[sw.subscriber] = sw.stream

	sw.queueHandler.mutex.Unlock()

	sw.queueHandler.SendFailedEventsFor(sw.subscriber)
}
