package db

import "testing"

func TestDbConnection_ConnectionURL(t *testing.T) {
	conn := &Connection{
		DbName:     "arch_test_1",
		User:       "postgres",
		Password:   "prostopetya",
		Host:       "localhost",
		DisableSSL: true,
	}
	if conn.ConnectionURL() != "postgres://postgres:prostopetya@localhost/arch_test_1?sslmode=disable" {
		t.Error("Unexpected connection string")
	}
}
