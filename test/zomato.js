/* eslint-disable max-len */

require('dotenv').config();
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Zomato = require('../lib/zomato');

chai.use(chaiAsPromised);
chai.should();

const apiKey = process.env.ZOMATO_API_KEY;
const zomato = new Zomato(apiKey);

describe('.categories()', function() {
    it('should return an array of categories', function() {
        return zomato
            .categories()
            .should.be.fulfilled.should.eventually.be.an('array')
            .should.eventually.have.length.of.at.least(13);
    });
});

describe('.cities(params)', function() {
    it('should return no location suggestions with missing params', function() {
        return zomato
            .cities({})
            .should.be.fulfilled.should.eventually.be.an('array')
            .should.eventually.have.length(0);
    });
    it('should return a location suggestion when given lat and lon', function() {
        return zomato
            .cities({ lat: 35.212587, lon: -80.813916 })
            .should.be.fulfilled.should.eventually.be.an('array')
            .should.eventually.have.length(1);
    });
});

describe('.collections(params)', function() {
    it('should be rejected with missing city_id or coordinates params', function() {
        return zomato
            .collections({})
            .should.be.rejectedWith('Request failed with status code 400');
    });
    it('should returns collections for the given location', function() {
        return zomato
            .collections({
                lat: 19.0895595,
                lon: 72.8634203,
                count: 5,
            })
            .should.be.fulfilled.should.eventually.be.an('array');
    });
});

describe('.cuisines(params)', function() {
    it('should be rejected with missing city_id or coordinates params', function() {
        return zomato
            .cuisines({})
            .should.be.rejectedWith('Request failed with status code 400');
    });
    it('should return cuisines for the given location', function() {
        return zomato
            .cuisines({
                lat: 19.0895595,
                lon: 72.8634203,
            })
            .should.be.fulfilled.should.eventually.be.an('array');
    });
});

describe('.establishments(params)', function() {
    it('should be rejected with missing city_id or coordinates params', function() {
        return zomato
            .establishments({})
            .should.be.rejectedWith('Request failed with status code 400');
    });
    it('should return establishments for the given location', function() {
        return zomato
            .establishments({
                lat: 19.0895595,
                lon: 72.8634203,
            })
            .should.be.fulfilled.should.eventually.be.an('array');
    });
});

// describe('.geocode(params)', function() {
//   it('should return with data for the given coordinates', function() {
//     return zomato
//       .geocode({
//         lat: 19.0895595,
//         lon: 72.8634203,
//       })
//       .should.be.fulfilled.should.eventually.be.an('object')
//       .should.eventually.have.deep.property('location.country_name', 'India')
//   })
// })

describe('.locations(params)', function() {
    it("should return with one location suggestion when query is 'Mumbai'", function() {
        return zomato
            .locations({
                query: 'Mumbai',
            })
            .should.be.fulfilled.should.eventually.be.an('array')
            .should.eventually.have.length(1);
    });
});

// describe('.locationDetails(params)', function() {
//   it('should return with data for the given params', function() {
//     return zomato
//       .locationDetails({
//         entity_id: 3,
//         entity_type: 'city',
//       })
//       .should.be.fulfilled.should.eventually.be.an('object')
//       .should.eventually.have.a.deep.property('location.city_name', 'Mumbai')
//   })
// })

describe('.restaurant(params)', function() {
    it('should return with data for the given params', function() {
        return zomato
            .restaurant({ res_id: 34383 })
            .should.be.fulfilled.should.eventually.be.an('object')
            .should.eventually.have.a.property('name', 'Leopold Cafe & Bar');
    });
});

describe('.dailyMenu(params)', function() {
    it('should be rejected for the given params', function() {
        return zomato
            .dailymenu({ res_id: 34383 })
            .should.be.rejectedWith('Request failed with status code 400');
    });
    it('should return the dailymenu for the given restaurant id', function() {
        return zomato
            .dailymenu({ res_id: 16507902 })
            .should.be.fulfilled.should.eventually.be.an('array');
    });
});

describe('.reviews(params)', function() {
    it('should return with reviews list with the given params', function() {
        return zomato
            .reviews({
                res_id: 34383,
            })
            .should.be.fulfilled.should.eventually.be.an('object')
            .should.eventually.have.property('user_reviews');
    });
});

describe('.search(params)', function() {
    it('should return with list of restaurants for the given params', function() {
        return zomato
            .search({
                q: 'Leopold Cafe & Bar',
            })
            .should.be.fulfilled.should.eventually.be.an('object')
            .should.eventually.have.property('restaurants');
    });
});
