package chrono

import (
	_ "embed"
	"time"

	"github.com/dop251/goja"
	"github.com/pkg/errors"
)

//go:embed chrono.out.js
var chronoJS string

// Chrono struct
type Chrono struct {
	VM   *goja.Runtime
	Fn   goja.Callable
	This goja.Value
}

// New chrono instance
func New() (chrono Chrono, err error) {
	vm := goja.New()
	prg, err := goja.Compile("chrono.js", chronoJS, false)
	if err != nil {
		return chrono, errors.Wrap(err, "couldn't compile chrono")
	}

	_, err = vm.RunProgram(prg)
	if err != nil {
		return chrono, errors.Wrap(err, "couldn't run chrono program")
	}

	fn, ok := goja.AssertFunction(vm.Get("chrono"))
	if !ok {
		return chrono, errors.New("couldn't get the chrono function")
	}

	return Chrono{
		This: vm.ToValue(map[string]interface{}{}),
		VM:   vm,
		Fn:   fn,
	}, nil
}

// Parse the time
func (c *Chrono) ParseDate(expr string, now time.Time) (t *time.Time, err error) {
	v, err := c.Fn(c.This, c.VM.ToValue(expr), c.VM.ToValue(now.Format(time.RFC3339)))
	if err != nil {
		return t, errors.Wrap(err, "unable to parse expression: '"+expr+"'")
	}

	switch o := v.Export().(type) {
	case time.Time:
		return &o, nil
	case nil:
		return nil, nil
	default:
		return t, errors.New("unable to parse expression: '" + expr + "'")
	}
}
