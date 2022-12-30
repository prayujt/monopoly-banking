#!/usr/bin/env python3
import mysql.connector

# | propName      | varchar(100) | YES  |     | NULL    |       |
# | price         | int          | YES  |     | NULL    |       |
# | mortgageValue | int          | YES  |     | NULL    |       |
# | rent          | int          | YES  |     | NULL    |       |
# | 1hRent        | int          | YES  |     | NULL    |       |
# | 2hRent        | int          | YES  |     | NULL    |       |
# | 3hRent        | int          | YES  |     | NULL    |       |
# | 4hRent        | int          | YES  |     | NULL    |       |
# | hotelRent     | int          | YES  |     | NULL    |       |
# | housePrice    | int          | YES  |     | NULL    |       |
# | color         | varchar(15)  | YES  |     | NULL    |       |

properties = [
    ['Progressive Field, Cleveland', 600000, 300000, 20000, 100000, 300000, 900000, 1600000, 2500000, 500000, 'brown'],
    ['Dallas, Texas', 600000, 300000, 40000, 200000, 600000, 1800000, 3200000, 4500000, 500000, 'brown'],
    ['Country Music Hall of Fame and Museum', 1000000, 500000, 60000, 300000, 900000, 2700000, 4000000, 5500000, 500000, 'light blue'],
    ['Gateway Arch, St. Louis', 1000000, 500000, 60000, 300000, 900000, 2700000, 4000000, 5500000, 500000, 'light blue'],
    ['Mall of America, Minneapolis', 1200000, 600000, 80000, 400000, 1000000, 3000000, 4500000, 6000000, 500000, 'light blue'],
    ['Centennial Olympic Park, Atlanta', 1400000, 700000, 100000, 500000, 1500000, 4500000, 6250000, 7500000, 1000000, 'pink'],
    ['Red Rocks Amphitheatre, Denver', 1400000, 700000, 100000, 500000, 1500000, 4500000, 6250000, 7500000, 1000000, 'pink'],
    ['Liberty Bell, Philadelphia', 1600000, 800000, 120000, 600000, 1800000, 5000000, 7000000, 9000000, 1000000, 'pink'],
    ['South Beach, Miami', 1800000, 900000, 140000, 700000, 2000000, 5500000, 7500000, 9500000, 1000000, 'orange'],
    ['Johnson Space Center, Houston', 1800000, 900000, 140000, 700000, 2000000, 5500000, 7500000, 9500000, 1000000, 'orange'],
    ['Pioneer Square, Seattle', 2000000, 1000000, 160000, 800000, 2200000, 6000000, 8000000, 10000000, 1000000, 'orange'],
    ['Camelback Mountain, Phoenix', 2200000, 1100000, 180000, 900000, 2500000, 7000000, 8750000, 10500000, 1500000, 'red'],
    ['Waikiki Beach, Honolulu', 2200000, 1100000, 180000, 900000, 2500000, 7000000, 8750000, 10500000, 1500000, 'red'],
    ['Disney World, Orlando', 2400000, 1200000, 200000, 1000000, 3000000, 7500000, 9250000, 11000000, 1500000, 'red'],
    ['French Quarter, New Orleans', 2600000, 1300000, 220000, 1100000, 3300000, 8000000, 9750000, 11500000, 1500000, 'yellow'],
    ['Hollywood, Los Angeles', 2600000, 1300000, 220000, 1100000, 3300000, 8000000, 9750000, 11500000, 1500000, 'yellow'],
    ['Golden Gate Bridge, San Francisco', 2800000, 1400000, 240000, 1200000, 3600000, 8500000, 10250000, 12000000, 1500000, 'yellow'],
    ['Las Vegas Blvd., Las Vegas', 3000000, 1500000, 260000, 1300000, 3900000, 9000000, 11000000, 12750000, 2000000, 'green'],
    ['Wrigley Field, Chicago', 3000000, 1500000, 260000, 1300000, 3900000, 9000000, 11000000, 12750000, 2000000, 'green'],
    ['White House, Washington D.C.', 3200000, 1600000, 280000, 1500000, 4500000, 10000000, 12000000, 14000000, 2000000, 'green'],
    ['Fenway Park, Boston', 3500000, 1750000, 350000, 1750000, 5000000, 11000000, 13000000, 15000000, 2000000, 'dark blue'],
    ['New York Skyline', 4000000, 2000000, 500000, 2000000, 6000000, 14000000, 17000000, 20000000, 2000000, 'dark blue'],
    ['O\'Hare International Airport', 2000000, 1000000, 250000, 250000, 500000, 1000000, 2000000, 2000000, 0, 'grey'],
    ['Los Angeles International Airport', 2000000, 1000000, 250000, 250000, 500000, 1000000, 2000000, 2000000, 0, 'grey'],
    ['John F. Kennedy International Airport', 2000000, 1000000, 250000, 250000, 500000, 1000000, 2000000, 2000000, 0, 'grey'],
    ['Hartsfield-Jackson Atlanta International Airport', 2000000, 1000000, 250000, 250000, 500000, 1000000, 2000000, 2000000, 0, 'grey'],
    ['Cell Phone Service', 1500000, 750000, 0, 0, 0, 0, 0, 0, 0, 'black'],
    ['Internet Service', 1500000, 750000, 0, 0, 0, 0, 0, 0, 0, 'black'],
]

mydb = mysql.connector.connect(
    host="",
    user="",
    password="",
    database=''
)

with mydb.cursor() as cur:
    for property_ in properties:
        cur.execute('INSERT INTO Properties VALUES("{0}", {1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9}, "{10}");'.format(property_[0], property_[1], property_[2], property_[3], property_[4], property_[5], property_[6], property_[7], property_[8], property_[9], property_[10]))
        mydb.commit()
