package workerpool

import "sync"

type Workerpool struct {
	availableWorkersChannel chan chan Work
	workersPool             []*Worker
	queuedWorkChannel       chan Work
}

func NewWorkerPool(workersSize int, queueSize int) *Workerpool {
	workerpool := &Workerpool{
		make(chan chan Work),
		make([]*Worker, workersSize, workersSize),
		make(chan Work, queueSize),
	}

	wg := sync.WaitGroup{}

	for i := 0; i < workersSize; i++ {
		workerpool.workersPool[i] = newWorker(i+1, workerpool.availableWorkersChannel, &wg)
		go workerpool.workersPool[i].dispatch()
	}

	go workerpool.dispatch()
	return workerpool
}

func (wp *Workerpool) AddJob(w Work) {
	wp.queuedWorkChannel <- w
}

func (wp *Workerpool) dispatch() {
	for {
		select {
		case work := <-wp.queuedWorkChannel:
			freeWorker := <-wp.availableWorkersChannel
			freeWorker <- work
		}
	}
}
