package workerpool

import "sync"

type Worker struct {
	id                  int
	availableWorkerPool chan chan Work
	work                chan Work
	done                *sync.WaitGroup
	quit                chan bool
}

func newWorker(id int, readyPool chan chan Work, done *sync.WaitGroup) *Worker {
	return &Worker{
		id,
		readyPool,
		make(chan Work),
		done,
		make(chan bool),
	}
}

func (w *Worker) dispatch() {
	for {
		w.availableWorkerPool <- w.work
		select {
		case work := <-w.work:
			work.Do()
		}
	}
}
