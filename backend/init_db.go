package main

import (
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	ID        uint `gorm:"primaryKey"`
	FirstName string
	LastName  string
	Username  string
	Password  string
	Email     string
	CreatedAt time.Time
	UpdatedAt time.Time
}	

type Office struct {
	ID   uint `gorm:"primaryKey"`
	Name string
	CreatedAt time.Time
	UpdatedAt time.Time
}

type Room struct {
	ID       uint `gorm:"primaryKey"`
	Name     string
	Capacity uint
	OfficeID uint
	Office   Office
	CreatedAt time.Time
	UpdatedAt time.Time
}

type Booking struct {
	gorm.Model
	Title     string
	UserID    uint
	User      User
	Start     time.Time
	End       time.Time
	RoomID    uint
	Room      Room
	Attendees uint
	CreatedAt time.Time
	UpdatedAt time.Time
}

func main() {
	dsn := "host=localhost user=postgres password=postgres dbname=test port=5432 sslmode=disable TimeZone=Asia/Tehran"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&User{})
	db.AutoMigrate(&Office{})
	db.AutoMigrate(&Room{})
	db.AutoMigrate(&Booking{})

	// Create all offices
	db.Create(&Office{ID: 1, Name: "NewYork"})
	db.Create(&Office{ID: 2, Name: "California"})
	db.Create(&Office{ID: 3, Name: "London"})
	db.Create(&Office{ID: 4, Name: "Toronto"})

	// Create rooms for each office
	db.Create(&Room{ID: 1, Name: "NY Single A", Capacity: 1, OfficeID: 1})
	db.Create(&Room{ID: 2, Name: "NY Single B", Capacity: 1, OfficeID: 1})
	db.Create(&Room{ID: 3, Name: "NY Multi A", Capacity: 4, OfficeID: 1})
	db.Create(&Room{ID: 4, Name: "NY Conference", Capacity: 12, OfficeID: 1})

	db.Create(&Room{ID: 5, Name: "California Single", Capacity: 1, OfficeID: 2})
	db.Create(&Room{ID: 6, Name: "California Conference A", Capacity: 12, OfficeID: 2})
	db.Create(&Room{ID: 7, Name: "California Conference B", Capacity: 12, OfficeID: 2})

	db.Create(&Room{ID: 8, Name: "London Single A", Capacity: 1, OfficeID: 3})
	db.Create(&Room{ID: 9, Name: "London Single B", Capacity: 1, OfficeID: 3})
	db.Create(&Room{ID: 10, Name: "London Multi A", Capacity: 5, OfficeID: 3})
	db.Create(&Room{ID: 11, Name: "London Conference A", Capacity: 12, OfficeID: 3})
	db.Create(&Room{ID: 12, Name: "London Conference B", Capacity: 12, OfficeID: 3})

	db.Create(&Room{ID: 13, Name: "Toronto Multi A", Capacity: 6, OfficeID: 4})
	db.Create(&Room{ID: 14, Name: "Toronto Conference", Capacity: 12, OfficeID: 4})
}
