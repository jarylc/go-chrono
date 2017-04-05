# chrono.go

Tiny golang wrapper for [chrono.js](https://github.com/wanasit/chrono).

## install

```
go get -u github.com/matthewmueller/chrono.go
```

## example

```go
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
	c, _ := chrono.New()
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
```

## license

mit
