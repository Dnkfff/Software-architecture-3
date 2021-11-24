//+build wireinject

package main

import (
	"github.com/google/wire"
	"github.com/roman-mazur/chat-channels-example/server/channels"
)

// ComposeApiServer will create an instance of CharApiServer according to providers defined in this file.
func ComposeApiServer(port HttpPortNumber) (*ChatApiServer, error) {
	wire.Build(
		// DB connection provider (defined in main.go).
		NewDbConnection,
		// Add providers from channels package.
		channels.Providers,
		// Provide ChatApiServer instantiating the structure and injecting channels handler and port number.
		wire.Struct(new(ChatApiServer), "Port", "ChannelsHandler"),
	)
	return nil, nil
}
