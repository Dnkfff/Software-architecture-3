package menu

import (
	"github.com/google/wire"
)

// Set of providers for channels components.
var Providers = wire.NewSet(NewStore, HttpHandler)
