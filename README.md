# chrono.go
Tiny golang wrapper for [chrono-node](https://github.com/wanasit/chrono).

## Usage
### Installation
```
go get -u github.com/jarylc/go-chrono
```
### Example
```go
package main

import (
	"fmt"
	"log"
	"time"
	"github.com/jarylc/go-chrono/v2"
)

func main() {
	c, err := chrono.New()
	if err != nil {
		log.Fatal(err)
	}

	t, err := c.ParseDate("tomorrow morning", time.Now())
	if err != nil {
		log.Fatal(err)
		return
	}

	fmt.Println(t)
}
```

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
Jaryl Chng - git@jarylchng.com
https://jarylchng.com
