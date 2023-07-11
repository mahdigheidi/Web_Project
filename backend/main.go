package main

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go/v4"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
	_ "golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB
var err error
var SecretKey *ecdsa.PrivateKey

const frontUrl = "http://localhost:3000"

type User struct {
	ID        uint `json:"id" gorm:"primaryKey"`
	FirstName string
	LastName  string
	Username  string `json:"username" gorm:"unique"`
	Password  []byte `json:"-"`
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
	ID        uint   `json:"id" gorm:"primaryKey"`
	Name      string `json:"name"`
	Capacity  uint   `json:"capacity"`
	OfficeID  uint   `json:"office_id"`
	Office    Office
	CreatedAt time.Time
	UpdatedAt time.Time
}

type Booking struct {
	gorm.Model
	Title     string
	UserID    uint
	User      User
	Starts    pq.StringArray `gorm:"type:text[]"`
	Ends      pq.StringArray `gorm:"type:text[]"`
	RoomID    uint
	Room      Room
	OfficeID  uint
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

	// Create all users
	// password, _ := bcrypt.GenerateFromPassword([]byte("1111"), 14)
	// db.Create(&User{ID: 1, Username: "user1", Password: password})
	// db.Create(&User{ID: 2, Username: "user2", Password: password})
	// db.Create(&User{ID: 3, Username: "user3", Password: password})
	// db.Create(&User{ID: 4, Username: "user4", Password: password})
	// db.Create(&User{ID: 5, Username: "user5", Password: password})

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

	// db.Create(&Booking{
	// 	Title:  "Backend meeting",
	// 	UserID: 4,
	// 	Start:  time.Now(),
	// 	End:    time.Now().Add(time.Hour * 3),
	// 	RoomID: 1,
	// })
	// db.Create(&Booking{
	// 	Title:  "Frontend meeting",
	// 	UserID: 5,
	// 	Start:  time.Now(),
	// 	End:    time.Now().Add(time.Hour * 3),
	// 	RoomID: 1,
	// })
	// db.Create(&Booking{
	// 	Title:  "HR meeting",
	// 	UserID: 4,
	// 	Start:  time.Now(),
	// 	End:    time.Now().Add(time.Hour * 3),
	// 	RoomID: 1,
	// })
}

func main() {
	SecretKey, _ = ecdsa.GenerateKey(elliptic.P256(), rand.Reader)

	dsn := "host=localhost user=postgres password=postgres dbname=test port=5435 sslmode=disable TimeZone=Asia/Tehran"
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

	r.POST("/register/", Register)
	r.POST("/login/", Login)
	r.GET("/check_user/", CheckUser)
	r.POST("/logout/", Logout)

	r.GET("/user/", GetUsers)
	r.GET("/user/:id", GetUser)
	r.POST("/user", CreateUser)
	r.PUT("/user/:id", UpdateUser)
	r.DELETE("/user/:id", DeleteUser)

	r.GET("/booking/", GetBookings)
	r.GET("/booking/:id", GetBooking)
	r.POST("/add_booking", CreateBooking)
	r.POST("/add_week_booking", CreateWeekBooking)
	r.PUT("/booking/:id", UpdateBooking)
	r.DELETE("/booking/:id", DeleteBooking)

	config := cors.DefaultConfig()
	// config.AllowAllOrigins = true
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AddAllowHeaders("Access-Control-Allow-Credintials")
	config.AddAllowHeaders("Access-Control-Allow-Origin")

	config.AllowCredentials = true
	config.AllowWildcard = true

	r.Use(cors.New(config))
	r.Run(":8080")
}

func Register(c *gin.Context) {
	c.Writer.Header().Set("Access-Control-Allow-Origin", frontUrl)
	// TODO : handle used username
	var jsonData map[string]string
	data, _ := ioutil.ReadAll(c.Request.Body)
	if e := json.Unmarshal(data, &jsonData); e != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	}
	// TODO : handle bad request
	password, _ := bcrypt.GenerateFromPassword([]byte(jsonData["password"]), 14)
	user := User{
		Username: jsonData["username"],
		Password: password,
	}
	db.Create(&user)
	c.JSON(200, user)
}

func Login(c *gin.Context) {
	// fmt.Println(c.Request.Header)
	// fmt.Println(c.res)
	c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
	var jsonData map[string]string
	data, _ := ioutil.ReadAll(c.Request.Body)
	if e := json.Unmarshal(data, &jsonData); e != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	}
	var user User
	if err := db.Where("username = ?", jsonData["username"]).First(&user).Error; err != nil {
		c.String(404, "Login failed.")
	} else {
		if err := bcrypt.CompareHashAndPassword(user.Password, []byte(jsonData["password"])); err != nil {
			c.String(404, "Wrong password.")
			return
		}
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodES256, jwt.StandardClaims{
		Issuer: strconv.Itoa(int(user.ID)),
		// ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	})

	token, err := claims.SignedString(SecretKey)

	if err != nil {
		c.String(404, "Login Failed on token.")
		fmt.Println(err)
		return
	}

	c.SetCookie(
		"jwt",
		token,
		time.Now().Hour()*24,
		"/",
		"localhost",
		false,
		true,
	)
	c.JSON(200, user)
}

func GetLoginnedUser(c *gin.Context) (*User, error) {
	cookie, err := c.Cookie("jwt")
	if err != nil {
		c.String(404, "No token!")
		return nil, err
	}
	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return SecretKey, nil
	})

	if err != nil {
		c.String(404, "Wrong token!")
		return nil, err
	}
	claims := token.Claims.(*jwt.StandardClaims)
	var user User

	if err := db.Where("id = ?", claims.Issuer).First(&user).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
		return nil, err
	} else {
		// c.JSON(200, user)
		return &user, nil
	}
}

func CheckUser(c *gin.Context) {
	c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
	if user, err := GetLoginnedUser(c); err != nil {
		return
	} else {
		fmt.Println(*user)
		c.JSON(200, *user)
	}
}

func Logout(c *gin.Context) {
	c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
	fmt.Println("logout?!")
	c.SetCookie(
		"jwt",
		"",
		0,
		"/",
		"localhost",
		false,
		true,
	)
	c.String(200, "Logout Success!")

}

func GetBookings(c *gin.Context) {
	c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
	var bookings []Booking
	if err := db.Find(&bookings).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.JSON(200, bookings)
	}
}

func GetRooms(c *gin.Context) {
	c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
	var rooms []Room
	if err := db.Find(&rooms).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.JSON(200, rooms)
	}
}

func GetOffices(c *gin.Context) {
	c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
	var offices []Office
	if err := db.Find(&offices).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.JSON(200, offices)
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
	var user *User
	if user, err = GetLoginnedUser(c); err != nil {
		fmt.Println("user not found")
		return
	}

	var jsonData map[string]string
	data, _ := ioutil.ReadAll(c.Request.Body)
	if e := json.Unmarshal(data, &jsonData); e != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	}

	startTime, err := ParseTime(jsonData["Start"])
	if err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
		return
	}
	endTime, err := ParseTime(jsonData["End"])
	if err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
		return
	}
	attendees, err := strconv.Atoi(jsonData["Attendees"])
	if err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
		return
	}
	roomId, err := strconv.Atoi(jsonData["RoomID"])
	if err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
		return
	}
	var room Room
	if err := db.Where("id = ?", roomId).First(&room).Error; err != nil {
		c.String(404, "Room not found")
		return
	}
	// days := []BookingDays{{startTime}}
	// days := []time.Time{startTime}
	starts := []string{startTime.Format(time.RFC3339)}
	ends := []string{endTime.Format(time.RFC3339)}
	var booking = Booking{
		RoomID:    uint(roomId),
		OfficeID:  room.OfficeID,
		UserID:    (*user).ID,
		Starts:    starts,
		Ends:      ends,
		Attendees: uint(attendees),
		Title:     jsonData["Title"],
	}

	fmt.Println("booook!")
	fmt.Println(room)
	db.Create(&booking)
	c.JSON(200, booking)
}

// func add_days(day time.Time) {
// 	id := db.Create(&BookingDays{day})
// 	fmt.Println(id)
// }

func CreateWeekBooking(c *gin.Context) {
	var user *User
	if user, err = GetLoginnedUser(c); err != nil {
		fmt.Println("user not found")
		return
	}

	var jsonData map[string]string
	data, _ := ioutil.ReadAll(c.Request.Body)
	if e := json.Unmarshal(data, &jsonData); e != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	}

	startDay, err := ParseTime(jsonData["start_day"])
	if err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
		return
	}
	endDay, err := ParseTime(jsonData["end_day"])
	if err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
		return
	}
	fmt.Println(endDay)
	startHour, err := ParseHour(jsonData["start_hour"])
	if err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
		return
	}
	endHour, err := ParseHour(jsonData["end_hour"])
	if err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
		return
	}
	attendees, err := strconv.Atoi(jsonData["Attendees"])
	if err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
		return
	}
	roomId, err := strconv.Atoi(jsonData["RoomID"])
	if err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
		return
	}
	var room Room
	if err := db.Where("id = ?", roomId).First(&room).Error; err != nil {
		c.String(404, "Room not found")
		return
	}
	// fmt.Println("hour", startHour.Hour(), endHour.Hour())
	// fmt.Println("hour", startHour, endHour)
	var bookings []Booking
	// days := []BookingDays{{startDay}}
	// days := []time.Time{startDay}
	days_count := endDay.Sub(startDay).Hours() / 24
	start_time := startDay.Add(startHour)
	end_time := startDay.Add(endHour)
	starts := []string{}
	ends := []string{}
	// // fmt.Println("start", start_time)
	// // fmt.Println("end", end_time)
	for i := 0; i < int(days_count); i++ {
		starts = append(starts, start_time.Format(time.RFC3339))
		ends = append(ends, end_time.Format(time.RFC3339))

		start_time = start_time.Add(time.Hour * 24)
		end_time = end_time.Add(time.Hour * 24)
		// days = append(days, BookingDays{startDay})
		// fmt.Println("booook!")
	}

	var booking = Booking{
		RoomID:    uint(roomId),
		OfficeID:  room.OfficeID,
		UserID:    (*user).ID,
		Starts:    starts,
		Ends:      ends,
		Attendees: uint(attendees),
		Title:     jsonData["Title"],
	}
	db.Create(&booking)

	c.JSON(200, bookings)
}

func ParseTime(t string) (time.Time, error) {
	time_layout := (time.RFC3339)[:19]
	pTime, err := time.Parse(time_layout, t)
	if err != nil {
		fmt.Println(err)
		return time.Now(), err
	}
	return pTime, nil
}

func ParseHour(t string) (time.Duration, error) {
	time_layout := (time.TimeOnly)[:5]
	pTime, err := time.Parse(time_layout, t)
	if err != nil {
		fmt.Println(err)
		return 0, err
	}
	d := time.Duration(pTime.Hour()*int(time.Hour) + pTime.Minute()*int(time.Minute))
	return d, nil
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
