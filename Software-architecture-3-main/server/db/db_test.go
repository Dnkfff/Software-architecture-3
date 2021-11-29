package db

import "testing"

func TestDbConnection_ConnectionURL(t *testing.T) {
	conn := &Connection{
		DbName:     "arch_test_1",
		User:       "postgres",
		Password:   "141592",
		Host:       "localhost",
		DisableSSL: true,
	}
	if conn.ConnectionURL() != "postgres://postgres:141592@localhost/arch_test_1?sslmode=disable" {
		t.Error("Unexpected connection string")
	}
}
