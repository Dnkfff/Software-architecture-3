//+build wireinject

package main

import (
	"github.com/google/wire"
	"github.com/ddynikov/Software-architecture-3/server/menu"
)

// ComposeApiServer will create an instance of CharApiServer according to providers defined in this file.
func ComposeApiServer(port HttpPortNumber) (*ChatApiServer, error) {
	wire.Build(
		// DB connection provider (defined in main.go).
		NewDbConnection,
		// Add providers from channels package.
		menu.Providers,
		// Provide ChatApiServer instantiating the structure and injecting channels handler and port number.
		wire.Struct(new(ChatApiServer), "Port", "MenuHandler"),
	)
	return nil, nil
}
