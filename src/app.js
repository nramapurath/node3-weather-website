const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const options = {
    extensions: ['html', 'htm']
}

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath, options))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather now',
        name: 'Navaneeth'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Navaneeth'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        msg: 'Try turning it off and on again',
        title: 'Help',
        name: 'Navaneeth'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    } else {
        geocode(req.query.address, (error, {location, latitude, longitude} = {}) => {
            if (error) {
                return res.send({ error })
            }
            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({ error })
                }
                res.send({
                    forecast: forecastData,
                    location,
                    address: req.query.address
                })
            })
        })
    }
    

    
    // res.send({
    //     forecast: 'Clear',
    //     location: 'Boston',
    //     address: req.query.address
    // })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMsg: 'Help article not found',
        title: 'Error 404',
        name: 'Navaneeth'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        errorMsg: 'Page not found',
        title: 'Error 404',
        name: 'Navaneeth'
    })
})

app.listen(3000, () => {
    console.log('Server up on port 3000.')
})