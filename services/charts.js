const https = require('https');
const axios = require('axios');

const PEOPLE_LIST_URL = 'https://swapi.dev/api/people';


// Problem to solve: 
// Main challenge: how to fetch all vehicles matching them to their owner
// while also avoiding unnecessary calls, blocks and iterations
// Wonder: is there a better solution to Promise.all ?

class ChartsService {
  constructor() { }

  /**
 * Returns a list of chart data, comprised of an array of labels
 * @example
 * { "charts": [ { "label": ["Person1", "Person2"], "values": [ [ "Vehicle1", "Vehicle2"] ] } ] }
 * 
 */
  async getCharts() {
    const { data } = await axios.get(PEOPLE_LIST_URL);
    const { results = [] } = data;
    
    // step one: transform the People array to a { person: vehicles } map
    const temp = results.reduce((map, person) => { 
      map[person.name] = person.vehicles;
      return map;
    }, {});
    
    let result = { label: [], values: [] };

    // step two: resolve all vehicle models, if they exist. 
    // then update the result object with each person's vehicle models
    for (const [person, vehicleUrls] of Object.entries({...temp})) {
      result.label.push(person);
      let vehicles = [];
      if (vehicleUrls.length) {
        const fetchVehicles = await Promise.all(vehicleUrls.map(async v => await axios.get(v)));
        vehicles = fetchVehicles.map(res => res.data.model);
      }
      result.values.push(vehicles);
    }
    return { charts: [ result ] }; 
  }
}

module.exports = ChartsService;

