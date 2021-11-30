package menu

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/ddynikov/Software-architecture-3/server/tools"
)

// Channels HTTP handler.
type HttpHandlerFunc http.HandlerFunc

type Order struct {
	Array []int
	Desc  int64
}

// HttpHandler creates a new instance of channels HTTP handler.
func HttpHandler(store *Store) HttpHandlerFunc {
	return func(rw http.ResponseWriter, r *http.Request) {
		if r.Method == "GET" {
			handleGetMenu(store, rw)
		} else if r.Method == "POST" {
			handleOrderCreate(r, rw, store)
		} else if r.Method == "PUT" {
			handleGetOrders(store, rw)
		} else {
			rw.WriteHeader(http.StatusMethodNotAllowed)
		}
	}
}

func handleOrderCreate(r *http.Request, rw http.ResponseWriter, store *Store) {
	var c OrderRequest
	log.Println(r)
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		log.Printf("Error decoding channel input: %s", err)
		tools.WriteJsonBadRequest(rw, "bad JSON payload")
		return
	}
	var orderObject = Order{c.Items, c.Desk}
	err := store.CreateOrder(orderObject)
	if err == nil {
		tools.WriteJsonOk(rw, &c)
	} else {
		log.Printf("Error inserting record: %s", err)
		tools.WriteJsonInternalError(rw)
	}
}

func handleGetMenu(store *Store, rw http.ResponseWriter) {
	res, err := store.getMenu()
	if err != nil {
		log.Printf("Error making query to the db: %s", err)
		tools.WriteJsonInternalError(rw)
		return
	}
	tools.WriteJsonOk(rw, res)
}

func handleGetOrders(store *Store, rw http.ResponseWriter) {
	res, err := store.getOrders()
	if err != nil {
		log.Printf("Error making query to the db: %s", err)
		tools.WriteJsonInternalError(rw)
		return
	}
	tools.WriteJsonOk(rw, res)
}
