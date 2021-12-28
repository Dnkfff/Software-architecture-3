package menu

import (
	"database/sql"
	"encoding/json"
	"fmt"
)

type MenuItem struct {
	Id    int64  `json:"id"`
	Name  string `json:"name"`
	Price int64  `json:"price"`
}

type OrderItem struct {
	Id      int64  `json:"id"`
	Content string `json:"content"`
	Sum     int64  `json:"sum"`
	Desk    int64  `json:"desk"`
}

type OrderRequest struct {
	Items []int `json:"items"`
	Desk  int64 `json:"desk"`
}

type Store struct {
	Db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{Db: db}
}

func (s *Store) getMenu() ([]*MenuItem, error) {
	rows, err := s.Db.Query("SELECT id, name, price FROM menu LIMIT 200")
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var res []*MenuItem
	for rows.Next() {
		var c MenuItem
		if err := rows.Scan(&c.Id, &c.Name, &c.Price); err != nil {
			return nil, err
		}
		res = append(res, &c)
	}
	if res == nil {
		res = make([]*MenuItem, 0)
	}
	return res, nil
}

func (s *Store) CreateOrder(order Order) error {
	if len(order.Array) < 0 {
		return fmt.Errorf("order must have at least one item from menu")
	}
	if order.Desc < 0 {
		return fmt.Errorf("order must be created with a desc number")
	}

	_, getMenuError := s.getMenu()
	if getMenuError != nil {
		return getMenuError
	}

	var menu []MenuItem
	err1 := json.Unmarshal([]byte(convertedJson), &menu)
	if err1 != nil {
		return err1
	}

	var menuBeforeJson []MenuItem
	var globalSum int = 0

	for _, mainMenuItem := range menu {
		for _, reqMenuItem := range order.Array {
			if mainMenuItem.Id == int64(reqMenuItem) {
				menuBeforeJson = append(menuBeforeJson, mainMenuItem)
				globalSum = globalSum + int(mainMenuItem.Price)
			}
		}
	}
	menuToDb, convertedError := json.Marshal(menuBeforeJson)
	if convertedError != nil {
		return convertedError
	}

	_, err := s.Db.Exec("INSERT INTO orders (content, sum, desk) VALUES ($1, $2, $3)", menuToDb, globalSum, order.Desc)

	return err
}

func (s *Store) getOrders() ([]*OrderItem, error) {
	rows, err := s.Db.Query("SELECT id, content, sum, desk FROM orders LIMIT 200")
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var res []*OrderItem
	for rows.Next() {
		var c OrderItem
		if err := rows.Scan(&c.Id, &c.Content, &c.Sum, &c.Desk); err != nil {
			return nil, err
		}
		res = append(res, &c)
	}
	if res == nil {
		res = make([]*OrderItem, 0)
	}
	return res, nil
}
