package menu

import (
	"database/sql"
	"fmt"
)

type MenuItem struct {
	Id    int64  `json:"id"`
	Name  string `json:"name"`
	Price int64  `json:"price"`
}

type Store struct {
	Db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{Db: db}
}

func (s *Store) getMenu() ([]*MenuItem, error) {
	rows, err := s.Db.Query("SELECT id, name FROM menu LIMIT 200")
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var res []*MenuItem
	for rows.Next() {
		var c MenuItem
		if err := rows.Scan(&c.Id, &c.Name); err != nil {
			return nil, err
		}
		res = append(res, &c)
	}
	if res == nil {
		res = make([]*MenuItem, 0)
	}
	return res, nil
}

func (s *Store) CreateChannel(name string) error {
	if len(name) < 0 {
		return fmt.Errorf("channel name is not provided")
	}
	_, err := s.Db.Exec("INSERT INTO channels (name) VALUES ($1)", name)
	return err
}
