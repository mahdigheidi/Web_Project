package main

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB
var err error


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
	ID        uint `gorm:"primaryKey"`
	Name      string
	CreatedAt time.Time
	UpdatedAt time.Time
}

type Room struct {
	ID        uint `gorm:"primaryKey"`
	Name      string
	Capacity  uint
	OfficeID  uint
	Office    Office
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

func init_db() {
	fmt.Println("initializing database")
	// dsn := "host=localhost user=postgres password=postgres dbname=test port=5432 sslmode=disable TimeZone=Asia/Tehran"
	// db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	// if err != nil {
	// 	panic("failed to connect database")
	// }

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

func main() {
	dsn := "host=localhost user=postgres password=postgres dbname=test port=5432 sslmode=disable TimeZone=Asia/Tehran"
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	var offices []Office
	db.Raw("SELECT * FROM offices").Scan(&offices)
	if len(offices) == 0 {
		init_db()
	}

	r := gin.Default()

	r.GET("/office/", GetOffices)
	r.GET("/room/", GetRooms)
	
	r.GET("/user/", GetUsers)
	r.GET("/user/:id", GetUser)
	r.POST("/user", CreateUser)
	r.PUT("/user/:id", UpdateUser)
	r.DELETE("/user/:id", DeleteUser)

	r.GET("/booking/", GetBookings)
	r.GET("/booking/:id", GetBooking)
	r.POST("/booking", CreateBooking)
	r.PUT("/booking/:id", UpdateBooking)
	r.DELETE("/booking/:id", DeleteBooking)
	r.Run(":8080")
}

func GetOffices(c *gin.Context) {
	var offices []Office
	if err := db.Find(&offices).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.JSON(200, offices)
	}
}

func GetRooms(c *gin.Context) {
	var rooms []Room
	if err := db.Find(&rooms).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.JSON(200, rooms)
	}
}

func GetUsers(c *gin.Context) {
	var users []User
	if err := db.Find(&users).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.JSON(200, users)
	}
}

func GetUser(c *gin.Context) {
	id := c.Params.ByName("id")
	var user User
	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.JSON(200, user)
	}
}

func CreateUser(c *gin.Context) {
	var user User
	c.BindJSON(&user)
	db.Create(&user)
	c.JSON(200, user)
}

func UpdateUser(c *gin.Context) {
	var user User
	id := c.Params.ByName("id")
	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	}
	c.BindJSON(&user)
	db.Save(&user)
	c.JSON(200, user)
}

func DeleteUser(c *gin.Context) {
	id := c.Params.ByName("id")
	var user User
	d := db.Where("id = ?", id).Delete(&user)
	fmt.Println(d)
	c.JSON(200, gin.H{"id #" + id: "deleted"})
}


func GetBookings(c *gin.Context) {
	var bookings []Booking
	if err := db.Find(&bookings).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.JSON(200, bookings)
	}
}

func GetBooking(c *gin.Context) {
	id := c.Params.ByName("id")
	var booking Booking
	if err := db.Where("id = ?", id).First(&booking).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.JSON(200, booking)
	}
}

func CreateBooking(c *gin.Context) {
	var booking Booking
	c.BindJSON(&booking)
	db.Create(&booking)
	c.JSON(200, booking)
}

func UpdateBooking(c *gin.Context) {
	var booking Booking
	id := c.Params.ByName("id")
	if err := db.Where("id = ?", id).First(&booking).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	}
	c.BindJSON(&booking)
	db.Save(&booking)
	c.JSON(200, booking)
}

func DeleteBooking(c *gin.Context) {
	id := c.Params.ByName("id")
	var booking Booking
	d := db.Where("id = ?", id).Delete(&booking)
	fmt.Println(d)
	c.JSON(200, gin.H{"id #" + id: "deleted"})
}
