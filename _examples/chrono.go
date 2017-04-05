package main

import (
	"fmt"
	"os"
	"time"

	"github.com/apex/log"
	"github.com/apex/log/handlers/text"
	"github.com/matthewmueller/chrono"
)

func main() {
	log.SetHandler(text.New(os.Stderr))
	c, err := chrono.New()
	if err != nil {
		log.WithError(err).Fatal("cant compile")
	}

	t, err := c.ParseDate("tomorrow morning", time.Now())
	if err != nil {
		log.WithError(err).Fatal("unable to parse")
		return
	}

	fmt.Println(t)
}
