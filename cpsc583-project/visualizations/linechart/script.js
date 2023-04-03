let d3 = window.d3;
let max = 10;
let xScale;
let startYear = 2003;
let endYear = 2021;
let yearsArray = [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
let filteredYears = yearsArray.filter(function(year) {
  return year >= startYear && year <= endYear;
});
window.onload = function () {
  // setup("global_food_prices.csv");
  setup(global_prices_csv);
};
var gggggg;
const MARGIN = {
  LEFT: 100,
  RIGHT: 100,
  TOP: 100,
  BOTTOM: 200,
};

// dimension of our workspace
const width = 1920,
  height = 1080;

var _lineGraph; //define a global reference for scatter plot

setup = function (dataPath, food, country, market) {
  //defining an easy reference for out SVG Container
  var svg = d3.select("#MAIN svg");

  // Title
  svg
    .append("text")
    .attr("x", width / 2 + 100)
    .attr("y", 100)
    .attr("text-anchor", "middle")
    .style("font-family", "Helvetica")
    .style("font-size", 76)
    .text("Line Graph");

  // Loading in our Data with D3
  d3.csv(dataPath).then(function (d) {
    //the data only exists within this scope
    var distinct = [];
    // for (var i = 0; i < d.length; i++)
    //   {
    //          if (!(d[i].adm0_name in distinct)) {
    //     distinct.push(d[i].adm0_name);
    //     let countryPicker = document.getElementById("countryPicker");
    //     countryPicker.options[countryPicker.options.length] = new Option(
    //       d[i].adm0_name,
    //       d[i].adm0_name
    //     );
    //   }
    //   }

    filteredYears = yearsArray.filter(function(year) {
      return year >= startYear && year <= endYear;
    });

    d = d.filter((i) => {
      return i.mp_year <= endYear && i.mp_year >= startYear;
    });

    if (food != null && food.length != 0) {
      d = d.filter((i) => {
        return food.includes(i.FoodName);
      });
    }
    if (country != null && country.length != 0) {
      d = d.filter((i) => {
        return country.includes(i.CountryName);
      });
    }
    if (market != null && market.length != 0) {
      d = d.filter((i) => {
        return market.includes(i.CityName);
      });
    }
    if (food == undefined || country == undefined || market == undefined) d = [];
    else if (food.length == 0 || country.length == 0  || market.length == 0 ) d = [];
    
       var values = d.map(function(vvv) { return +vvv.mp_price; });
  
  // find the maximum value
  max = d3.max(values);
  max = 1.1 * max;
  
  gggggg = d;
    // create a barchart object
    _lineGraph = new lineGraph(d, svg, market);
    _lineGraph.draw();
  });
};

let lineGraph = function (data, svg, market) {
  // x scale will contain years
  xScale = d3
    .scaleBand()
    //.scaleLinear()
    //.domain([2016,  2021])
    .domain(filteredYears) // TODO: adjust because we filtered from a certain year
    .range([MARGIN.LEFT, width - MARGIN.RIGHT]);


  
  // y scale will contain price,
  let yScale = d3
    .scaleLinear()
    .domain([0, max]) // FIX ME
    .range([height - MARGIN.BOTTOM, MARGIN.TOP]);

  //draws our barchart
  this.draw = function () {
    let chart = svg.append("g").attr("class", "scatterPlot");

    var yAxis = d3.axisLeft().scale(yScale);

    // draw y-axis
    chart
      .append("g")
      .attr("transform", "translate(" + MARGIN.LEFT + "," + 0 + ")")
      .call(yAxis);

    var xAxis = d3
      .axisBottom()
      .scale(xScale)
      .tickValues([2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021])
      .ticks(5);

    // draw x-axis
    chart
      .append("g")
      .attr(
        "transform",
        "translate(" + 0 + "," + (height - MARGIN.BOTTOM) + ")"
      )
      .attr("class", "xAxis")
      .call(xAxis);

    const scale = 10;

    let VertLine = svg.append('line')
    .attr("transform","translate(150,100)")
    .style("stroke", "black")
    .style("stroke-width", 2)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", height - MARGIN.BOTTOM);

    // create a tooltip
var tooltip = d3.select("body")
.append("div")
.attr("class", "tooltip")
.style("opacity", 0);

svg.on("mousemove", function() {

var xPos = d3.pointer(event, this);
var bandIndex = Math.floor(xPos[0] / xScale.step());

console.log(); // Output: "C";

VertLine.attr("x1", xScale(xScale.domain()[bandIndex])-MARGIN.LEFT)
  .attr("x2", xScale(xScale.domain()[bandIndex])-MARGIN.LEFT)
  debugger
  let theYear = xScale.domain()[bandIndex];
  var yValues = data.filter(function(d) { return d.mp_year == theYear; }).map(function(d) {
    return d.CityName;
  });;
   // show tooltip
   tooltip.transition()
   .duration(200)
   .style("opacity", .9);
   var yValuesPrices = data.filter(function(d) { return d.mp_year == theYear; }).map(function(d) {
    return d.mp_price;
  });;

  var yValuesFoods = data.filter(function(d) { return d.mp_year == theYear; }).map(function(d) {
    return d.FoodName;
  });;

let text = "";

for(let i = 0; i < yValues.length; i++)
{
  text += "City: " + yValues[i] + "<br>";
  text += "Year: " + theYear + "<br>";
  text += "Food: " + yValuesFoods[i] + "<br>";
  text += "Price: " + yValuesPrices[i] + "<br>";
  text += "<br>";
}



        tooltip.html(text)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");

   
    // tooltip.html("Year: " + xScale.domain()[bandIndex])
    //     .style("left", (event.pageX + 10) + "px")
    //     .style("top", (event.pageY - 28) + "px");
  
});

    let circles = chart
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("stroke", "red")
      .attr("fill", "red")
      // x-axis encodes the sepal length
      // .attr("cx", (d) => xScale(d.mp_year)) // FIXME
      .attr("cx", function (d) {
        // console.log(d.mp_year);
        return xScale(d.mp_year) + xScale.bandwidth() / 2;
      })

      // y-axis encodes the sepal width
      .attr("cy", (d) => {
        return yScale(d.mp_price);
      }) // FIXME
      // radius of circle encode petal width
      .attr("r", 3)
      .style("opacity", function (d) {
        // if (d.cm_name === "Bread - Retail" && d.adm1_name === "Badakhshan") {
        //   return 1;
        // } else {
        //   return 0;
        // }
        return 1;
      });
  };
  //var data = data[0];

  var foodCategories = ['Bread - Retail', 'Rice (low quality) - Retail', 'Rice (high quality) - Retail',
 'Meat (chicken) - Retail', 'Eggs - Retail', 'Milk - Retail', 'Meat (beef) - Retail',
 'Meat (pork) - Retail', 'Meat (lamb) - Retail','Fish (frozen) - Retail', 'Carrots - Retail', 
 'Onions - Retail', 'Potatoes - Retail', 'Beans - Retail', 'Salt - Retail',
 'Apples (red) - Retail', 'Tomatoes - Retail', 'Oranges - Retail', 'Wheat - Retail',
 'Bread (wheat) - Retail', 'Oil (vegetable) - Retail', 'Oil (sunflower) - Retail', 
 'Sugar (white) - Retail', 'Cabbage - Retail', 'Garlic - Retail', 'Sugar (local) - Retail', 
 'Pasta - Retail', 'Cucumbers - Retail', 'Wheat flour (first grade) - Retail', 
 'Walnuts - Retail', 'Peas - Retail', 'Tea (black) - Retail'];

  var subdata = [];

  foodCategories.forEach(function (foodCategory) {
    data = data.filter((i) => {
      return i.mp_year <= endYear && i.mp_year >= startYear;
    });
    subdata2 = data.filter((ss) => {
      return ss.FoodName == foodCategory;
    });
    market.forEach(element => {
      subdata = subdata2.filter((ss) => {
        return ss.CityName == element;
      });
      subdata.sort((a,b) => a.mp_year - b.mp_year);
      // Plot line
      // FIXME: draw line for only a specific case like the circles
      var color = d3.rgb(Math.random() * 255, Math.random() * 255, Math.random() * 255);
      var line = d3
        .line()
        .x((d) => xScale(d.mp_year) + xScale.bandwidth() / 2)
        .y((d) => yScale(d.mp_price))
        .curve(d3.curveMonotoneX);
      svg
        .append("path")
        .datum(subdata)
        .attr("class", "line")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", color.toString())
        .style("stroke-width", "2");

    });
  });
};

var opts = [];
var opts2 = [];
var opts3 = [];

function val(sel) {
  d3.select("svg").remove();
  d3.select("#MAIN").append("svg");
  var opt;
  opts = [];
  var len = sel.options.length;
  for (var i = 0; i < len; i++) {
    opt = sel.options[i];

    if (opt.selected) {
      opts.push(opt.innerHTML);
    }
  }

  //setup("global_food_prices.csv", opts);
  setup(global_prices_csv, opts, opts2, opts3);
}
const citiesByCountry = {
"Philippines": ['Apayao', 'Misamis Oriental', 'Cabanatuan', 'Sulu', 'Palawan', 'Northern Samar', 'Camarines Sur', 'Siquijor', 'Lanao del Sur', 'Tacloban', 'Kidapawan', 'San Fernando', 'Laguna', 'Davao del Sur', 'Zamboanga', 'Capiz', 'Pampanga', 'Tarlac', 'Agusan del Norte', 'Batangas', 'Isabela', 'Guimaras', 'Zamboanga del Sur', 'Sorsogon', 'Bataan', 'Tandag', 'Basilan', 'Zamboanga del Norte', 'Ifugao', 'Davao del Norte', 'Romblon', 'Davao de Oro', 'Agusan del Sur', 'Benguet', 'Iloilo', 'Cagayan de Oro', 'Camiguin', 'Mountain Province', 'Baguio', 'Legazpi', 'Eastern Samar', 'Ilocos Norte', 'Negros Occidental', 'La Union (Ilocos Region)', 'Bukidnon', 'Rizal', 'Zamboanga Sibugay', 'Cebu', 'Quirino', 'Quezon', 'Misamis Occidental', 'Puerto Princesa', 'Tubod', 'Lingayen', 'Davao Oriental', 'Butuan', 'Marinduque', 'Catarman', 'Bulacan', 'Negros Oriental', 'Cotabato', 'Cavite', 'Zambales', 'Sarangani', 'Pangasinan', 'Kalinga', 'Davao', 'Metro Manila', 'Sultan Kudarat', 'Tuguegarao', 'Surigao del Norte', 'Ilocos Sur', 'Camarines Norte', 'Koronadal', 'South Cotabato', 'La Trinidad', 'Naga', 'Surigao del Sur', 'Leyte', 'Palayan', 'Nueva Ecija', 'Oriental Mindoro', 'Maguindanao', 'Masbate', 'Santa Cruz', 'Calapan', 'Aklan', 'Aurora', 'Lanao del Norte', 'Shariff Aguak', 'Bohol', 'Abra', 'Catanduanes', 'Albay', 'Cagayan', 'Nueva Vizcaya', 'Antique', 'Occidental Mindoro'],
"Lebanon": ['Zahle', 'Saida', 'Sour', 'Baalbeck', 'El Metn', 'West Beqaa', 'Bint Jbeil', 'Nabatiyeh', 'Akkar', 'Tripoli', 'Zgharta', 'Hasbaya', 'Aley', 'Rashaya', 'Bechare', 'Baabda', 'Jezzine', 'Marjayoun', 'Chouf', 'Koura', 'Beirut', 'Jbeil', 'Minieh-Dannieh', 'Batroun', 'Keserwan', 'Hermel'],
"Bassas da India": ['Panaji', 'Aizawl', 'Kanpur', 'Jadcherla', 'Karimnagar', 'Jammu', 'Jeypore', 'Ahmedabad', 'Tura', 'Dharmapuri', 'Balasore', 'Purulia', 'Madhubani', 'Chandigarh', 'Bokaro', 'Bharatpur', 'Raiganj', 'Ramanathapuram', 'Bengaluru', 'Bellary', 'Dindigul', 'Dharamshala', 'Adilabad', 'Lucknow', 'Bathinda', 'Muzzafarpur', 'Bareilly', 'Sambalpur', 'Simdega', 'T.Puram', 'Panchkula', 'Bilaspur', 'Thiruchirapalli', 'Shivamogga', 'Dhavanagere', 'Agartala', 'Bhopal', 'Saharanpur', 'Tirunelveli', 'Jhabua', 'Ujjain', 'Gurgaon', 'Port Blair', 'Kurnool', 'Una', 'Vijaywada', 'Bilaspur-hp', 'Chennai', 'Indore', 'Mandi', 'Darbhanga', 'Tirupathi', 'Malda', 'Ambikapur', 'Srinagar', 'Kalaburagi', 'Dimapur', 'Bhubaneshwar', 'Imphal', 'Coimbatore', 'Visakhapatnam', 'Bengaluru (east range)', 'Munger', 'Jhansi', 'Delhi', 'Ayodhya', 'Sagar', 'Palakkad', 'Ajmer', 'Saran', 'Kota', 'Vijayapur', 'Rourkela', 'Nagpur', 'Kharagpur', 'Gwalior', 'Gumla', 'Rudrapur', 'Mayabunder', 'Rajkot', 'Guwahati', 'Ernakulam', 'Sahibganj', 'Rewa', 'Meerut', 'Jabalpur', 'Dehradun', 'Jaipur', 'Khagaria', 'Wayanad', 'Vellore', 'Hyderabad', 'Siliguri', 'Raipur', 'Suryapet', 'Mumbai', 'Purnia', 'Haridwar', 'Cuttack', 'Thrissur', 'Bihar_Gaya', 'Mirzapur (vindhyanchal)', 'Durg', 'Solan', 'Kozhikode', 'Dharwad', 'Ludhiana', 'Kolkata', 'Rohtas (sasaram)', 'Jowai', 'Hisar', 'Moradabad', 'Gangtok', 'Nawada', 'National Average', 'Rampurhat', 'Itanagar', 'Allahabad', 'Mangalore', 'Araria', 'Aligarh', 'Bikaner', 'Nashik', 'Varanasi', 'Shahdol', 'Haldwani', 'Berhampur', 'Lohardaga', 'Shillong', 'Tiruvanantapuram', 'Baripada', 'Cuddalore', 'Samastipur', 'Udaipur', 'Surat', 'Bhuj', 'Balangir', 'Gorakhpur', 'Motihari', 'Saharsa', 'Hoshangabad', 'Ranchi', 'Puducherry', 'Maharashtra_Pune', 'Karnal', 'Jagdalpur', 'Warangal', 'Amritsar', 'Belagavi', 'Agra', 'Patna', 'Bhagalpur', 'Shimla', 'Tumakuru', 'Katihar', 'Morena', 'Mysore', 'Jodhpur'],
"Zimbabwe": ['Skuta', 'Tsholotsho Business Centre', 'Rutenga (Mwenenzi)', 'Nyika Growth Point', 'Zvishavane Urban', 'Mount Darwin', 'Bazha', 'Nyamukoho', 'Bhundu Shopping Centre', 'Takavarasha', 'Dombotombo', 'Mbondweni', 'Mbare', 'Mandava', 'Dulibadzimu Market', 'Jimila', 'Tshovani', 'Avoca', 'Rusape', 'Siakobvu', 'Sizinda Shopping Centre', 'Kamunhu Shopping Centre', 'Neshuro', 'Kwekwe Industries', 'Gonye', 'Chomutukutu Business Centre', 'Kasenzi Business Center', 'Ascot Shopping Centre', 'Mucheke', 'Mukore', 'Nyatsato Business center', 'Nhakiwa', 'Mahombekombe', 'Gweru Urban', 'Redcliff', 'Checheche', 'Mbizo 2', 'Nkayi Growth Point', 'Chasvingo', 'Mutare CBD', 'Chikuku', 'Negande business centre', 'Amaveni', 'Rupangwana', 'Matibi', 'Mabasa', 'Sakubva', 'Marondera CBD', 'Sowa', 'Mola', 'Chipinge Urban', 'Sovelele', 'Homestead', 'Silalatshani', 'Sarahuro', 'Chegutu Urban', 'Mtapa', 'Old Pumula Shops', 'Katoto', 'Kotwa', 'Ngundu', 'Nyamatikiti Business Centre', 'Masvingo Urban', 'Njube', 'Marula', 'Chigumisirwa', 'Chiremwaremwa', 'Beula', 'Mbizo 1', 'Tongogara Refugee Camp 2', 'Renkini Bus Terminus', 'Tshabalala Basic Shopping Centre', 'Sebhumane', 'Masasa Industrial', 'Suswe', 'Siabuwa', 'Mbizo 4', 'Saint Joseph', 'Bulawayo', 'Gokwe', 'Bindura', 'Gwanda town', 'Rutenga', 'Kezi', 'Tshelanyemba', 'Maringire Business Centre', 'Makaha', 'Angwa', 'Kwekwe CBD', 'Nyamapanda', 'Old Mashoko', 'Chinhoyi CBD', 'Chiredzi Urban', 'Siphepha', 'Binga', 'Mary Mount Business Center', 'Nembudzia', 'Khame', 'Lutumba', 'Mupandawana', 'Chadcombe', 'Hwange Town Bus Terminus', 'Zezani', 'Chimhanda Business Centre', 'Chikombedzi', 'Mpumelelo', 'Muhlanguleni', 'Mabonyane', 'Norton', 'Mhandamabwe', 'Filabusi', 'Nyamande', 'Jumbo', 'Victoria Falls', 'Rushinga Growth Point', 'Torwood 2', 'Mashava', 'Maphisa', 'Beitbridge Urban', 'Damofalls Park', 'Vhugwi', 'Chikafa', 'Mambale'],
"Central African Republic": ['Bimbo', 'Damara', 'Ndélé', 'Ngaoundaye', 'Bégoua', 'Bangassou', 'Berbérati', 'Boali', 'Bouca', 'Bouar', 'Bria', 'Birao', 'Bozoum', 'Mbaïki', 'Bangui', 'Bossemptélé', 'Ippy', 'Zemio', 'Obo', 'Yaloké', 'Nola', 'Sibut', 'Batangafo', 'Bossangoa', 'Kaga-Bandoro', 'Boda', 'Paoua', 'Bayanga', 'Carnot', 'Bambari', 'Baoro', 'Bocaranga'],
"Burundi": ['Nyabikere', 'Muyange', 'Rusaka', 'Kinama', 'Kayanza', 'Gihamagara', 'Busoni', 'Kanyosha', 'Kamenge', 'Mabanda', 'Gitobe', 'Nyabihanga', 'Biyorwa', 'Matana', 'Buyengero', 'Gisuru', 'Giharo', 'Gitega', 'Kayogoro', 'Muyinga', 'Muramvya', 'Burambi', 'Wimpfizi', 'Kirundo', 'Mutaho', 'Bururi', 'Gasenyi', 'Jene', 'Mwaro', 'Muzinda', 'Gihogazi', 'Ruhehe', 'Rutana', 'Gitaza', 'Kayero', 'Biyogwa', 'Mukenke', 'Mabayi', 'Marangara', 'Ngozi', 'Kivyuka', 'Mishiha', 'Masanganzira', 'Bujumbura', 'Buhiga', 'Rugombo', 'Twinkwavu', 'Kigamba', 'Giteranyi', 'Bukirasazi', 'Nyagasasa', 'Kobero', 'Bukeye', 'Kayongozi', 'Bandaga', 'Musenyi', 'Rumonge', 'Cankuzo', 'Rubaho', 'Muhanga', 'Mihigo', 'Ruyigi', 'Mwakiro', 'Chez Siyoni', 'Gatabo', 'Kinyinya', 'Gasorwe', 'Makamba'],
"Cote d'Ivoire": ['Korhogo', 'Adjame', 'Odienne', 'Guiglo', 'Danane', 'Ferkessedougou', 'Bouake', 'Katiola', 'Duekoue', 'Boundiali', 'Man', 'Ouangolodougou'],
"Mali": ['Dangha', 'Tonka', 'Tin essako', 'Kidal', 'Échelle', 'Adjelhoc', 'Bankass', 'Goundam', 'Annefif', 'Niafunké', 'Koro', 'Amachach', 'Bamba', 'Douentza', "N'tillit", 'Douekire', 'Djoulouna', 'Bambara Maoude', 'Diafarabé', 'Menaka', 'Kikara', 'Tessalit', 'Diré', 'Ouattagouna', 'Gathi Loumo', 'Bankoma', 'Temera', 'Taboye', 'Youwarou', 'Ber', 'Bourem', 'Attara', 'Forgho', 'Bourem Inaly', 'Gossi', 'Haoussa Foulane', 'Abeibara', 'Lére', 'Bandiagara', 'Boni', 'Agazrahane', 'Hombori', 'Diguiciré', 'Ansongo', "N'gouma", 'Gounanbougou', 'Toguere Coumbe', 'Diondiori', 'Bintagoungou', 'Sareyamou', 'Tenenkou', 'Anderamboukane'],
"Myanmar": ['Taung Bazzar', 'Nam Hpat Kar', 'Kin Seik', 'Min Kan', 'Thaton Myo Ma Zay', 'Kutkai', 'Ban Wai', 'Rathedaung', 'Wai Maw', 'Myit Chae', 'Thiri Market', 'Myoma', 'Thantlang', 'Pang Yang', 'Pakokku Myo Ma Market', 'Shwe Yin Sae', 'Sanpya ward', 'Nyaung Chung', 'Falam', 'Mone Koe', 'Monyin Market', 'Magway', 'Toungup Main', 'Waingmaw', 'Pang Kham', 'Mindat Myoma Market', 'Kong Chang', 'Hopone', 'Mingalar market', 'Lower Ban Wai', 'Minbya Main', 'Wang Leng', 'Mong See', 'Kyein Ni Pyin', 'Ohn Taw Gyi', 'Hpakant Market', 'Chying Thung', 'Yenanchaung', 'Shin Pin Kai', 'Myin Hlut', 'Kyauk Ta Lone', 'Mindat', 'Hpasaung', 'Chipwi Market', 'Garayang', 'Tanai Market', 'Tangyan', 'Yaesagyo', 'Namhkam Market', 'Rathedaung Main', 'Long Tan', 'Kanthar', 'Man Ton Pa', 'Galeng', 'Paung Toke', 'Ai Cheng', 'Lungngo', 'Bilin Myo Ma Market', 'Gangaw', 'Nam Kam', 'Namtu', 'Matupi', 'Kaung Ming Sang', 'Taunggyi', 'Lin Haw', 'Alel Than Kyaw', 'Mong Hkawng', 'Lahe', 'Nam San Yang', 'Ying Phan', 'Tedim Municipal Market', 'Minbu Myo Ma Market', 'Mansi', 'Maungdaw', 'Kyein Chung', 'Municipal', 'Ah Nauk Pyin', 'Man Pan', 'Inn Din', 'Honai', 'Momauk', 'TBZY Myo Ma Zay', 'Sittwe', 'Muse', 'Sai Law', 'Baw Du Pha', 'Sanbaung', 'Mong Pawk', 'Ahpauk Wa', 'Hakha Myoma Market', 'Shaokai', 'Nyaung Pin Gyi', 'Kyaukpyu Main', 'Nget Chaung', 'Thiri Mingalar Market', 'Lay Yin Kwin', 'Paletwa Myoma Market', 'Man Wein Gyi', 'Ramci', 'Lashio Market', 'Manton', 'Moemauk', 'Tonzang', 'Yae Baw Market', 'Sin Tet Maw', 'Ah Nauk Ywe', 'KawKareik Myo Ma Market', 'Say Tha Mar Gyi', 'Konkyan', 'Myo Ma Zay', 'Kha Mauck Siek', 'Morhtai', 'Thae Chaung', 'Sadung', 'Zedi Pyin', 'Pakhangyi', 'Razua', 'Mone Yar', 'Mogaung Market', 'Myebon Main', 'Dar Paing', 'Tar Shwe Tang', 'Bhamo Market', 'Nga Khu Ra', 'Hnaring', 'Mya Thida', 'Natmauk Myoma Market', 'Shwegu', 'Ba Yint Naung', 'Kan Nar Market', 'Na Rat Sar', 'Kyauktaw Main', 'Mrauk-U Main', 'Shadaw', 'Taung Pyo Let Wai', 'Buthidaung', 'Home shop', 'Yebyu Market', 'Raldunn Market', 'Nawng Hkit', 'Wein Kao', 'Tuan Jie Cun', 'Hsihseng', 'Htilin', 'Site Kuang', 'Hlaing Bwe Myo Ma market', 'Myitkyina Myoma Market', 'Bhamo', 'Loijie', 'Kanpetlet', 'Laung Kyet', 'Mong Wee', 'Kalay', 'Laukkaing', 'Thet Kay Pyin', 'Shwe Hin Tar', 'Phekhon', 'Mone Baw', 'Dein Aw'],
"Benin": ['Ouesse', 'Karimama', 'Hozin', 'Dantokpa', 'Bembèrèkè', 'Ahidahomè (Porto-Novo)', 'Comé', 'Glazoué', 'Ouando', 'Banikoara', 'Parakou', 'Azowlissè', 'Kalalé', 'Tanguiéta', 'Kpedekpo', 'So-Ava', 'Savalou', 'Kétou', 'Sékou', 'Dassa-Zoumè', 'Péhunco', 'Malanville (CBM)', 'Kérou', 'Zinvié', 'Klouékanmè', 'Pobè', 'Bohicon', 'Sinendé', 'Nikki', 'Djougou', 'Zè', 'Ikpenlè', 'Covè', 'Ouègbo', 'Dangbo', 'Yoko', 'Dogbo', 'Sehoue', 'Azovè', 'Natitingou', 'Affamè', 'Abomey', 'Kassoua-Allah', 'Cobly', 'Tatonnoukon', 'Sèdjè-Dénou', 'Dasso', 'Bassila', 'Tchaourou', 'Zogbodomey'],
"Jordan": ['Jarash', 'Madaba', 'Zarqa', 'Al Karak', 'Al Tafilah', 'Maan', 'Amman', 'Irbid', 'Ajloun', 'Al Aqaba', 'Al Mafraq', 'Al Balqa', 'National Average'],
"Yemen": ['Mukalla', "Sana'a", 'Mahweet', 'Marib', 'Al Hudaydah (Hodieda)', 'Al Ghaidha', 'Al Hawta Town', 'Hajjah', 'Al Hazum', 'Dhamar', "Sa'ada", 'Soqatra (Hudaibo)', 'Haradh Town', 'Taiz', 'Sayoun', 'Ibb', 'Amran', 'Bani Matar', 'Attaq Town', 'Al Bayda', 'Aden', 'Al Jabeen', 'Addaleh Town', 'Zungubar'],
"Rwanda": ['Gaseke', 'Gatunda', 'Kabarondo', 'Gicumbi', 'Ntungaruze', 'Batiment', 'Mahama (Camp)', 'Muhondo', 'Mulindi', 'Ntunga', 'Mugera', 'Kimironko', 'Mubuga', 'Butare', 'Congo - Nil', 'Kageyo', 'Rukomo', 'Nyabiheke (Camp)', 'Mahoko', 'Nyamirambo', 'Karongi', 'Kamembe', 'Kayenzi', 'Rusumo', 'Kabeza', 'Birambo', 'Rugarama', 'Gasarenda', 'Ruyaga', 'Nyanza', 'Bubare', 'Matimba', 'Kabuga', 'Bugarama', 'Muhanga', 'Rushashi', 'Rwagitima', 'Gihembe (Camp)', 'Byumba', 'Bumazi', 'Kizi', 'Munini', 'Huye', 'Gisenyi', 'Gikongoro', 'Kivuruga', 'Kirambo', 'Mugina', 'Rushonga', 'Kimisagara', 'Gatore', 'Gashyushya', 'Kigeme (Camp)', 'Nyagatare', 'Kigeme', 'Ngororero', 'Kibirizi', 'Nyabugogo', 'Nganda', 'Nyamata', 'Ruhuha', 'Mukamira', 'Kicukiro', 'Mugombwa', 'Kinazi', 'Kabacuzi', 'Gahanga', 'Kibuye (Karongi)', 'Musanze', 'Rwamagana', 'Karenge', 'Rusine', 'Ndago', 'Kiziba (Camp)', 'Ruhengeri', 'Gacurabwenge', 'Nyakarambi', 'Nyamugari', 'Kibungo', 'Kabaya', 'Mukarange', 'Ruhango', 'Gakenke', 'Buhanda', 'Musha', 'Vunga', 'Nkora', 'Nkoto', 'Byangabo', 'Kiyanzi', 'Nyagahanika', 'Miko', 'Karambi', 'Bushenge', 'Base', 'Mugombwa (Camp)', 'Kigufi'],
"Indonesia": ['Pasar Batu', 'Pasar Legi (Kota Blitar)', 'Pasar Baru (sentral Majene) (Kab. Majene)', 'Pasar Pagi (Kota Tegal)', 'Pasar Cisalak', 'Pasar Seketeng', 'Pasar Puring', 'Pasar Wamanggu', 'Pasar Loktuan', 'Pasar Kranggot', 'Pasar Daya', 'Pasar Peunayong', 'Pasar Pembangunan', 'Pasar Minggu (Kota Bengkulu)', 'Pasar Tanjung (Kab. Jember)', 'Pasar Kartasura', 'Pasar Ngadirojo', 'Pasar Kranji', 'Pasar Sentral (Kab. Bulukumba)', 'Pasar Bangka', 'Pasar Delanggu', 'Pasar Yotefa Abepura', 'Pasar Bawah', 'Pasar Tual', 'Pasar Wosi', 'Pasar Pahing', 'Pasar Setono Betek', 'Pasar Rawa Indah', 'Pasar Pancasila', 'Pasar Boswezen', 'Pasar Cekkeng', 'Pasar Manonjaya', 'Pasar Tanjung (Kab. Tabalong)', 'Pasar Gede (Kab. Cilacap)', 'Pasar Baru (regional Mamuju) (Kab. Mamuju)', 'Pasar Aur Kuning', 'Pasar Bitingan', 'Pasar Jatinegara', 'Pasar Baru (Kab. Merauke)', 'Pasar Antasari', 'Pasar Langgur', 'Pasar Cik Puan', 'Pasar Andi Tadda', 'Pasar Manonda', 'Pasar Pulau Payung', 'Pasar Pelita', 'Pasar Sukaramai (Kab. Kampar)', 'Pasar Johar', 'Pasar Karombasan', 'Pasar Smep', 'Pasar Sentral (Kab. Bone)', 'Pasar Amahami', 'Pasar Mandalika', 'Pasar Pandan Sari', 'Pasar Raya', 'Pasar Gamalama', 'Pasar Lama (sentral Mamuju)', 'Pasar Baru (Kota Probolinggo)', 'Pasar Ujong Baro', 'Pasar Kota Boyolali (Kab. Boyolali)', 'Pasar Masomba', 'Pasar Besar (Kota Palangka Raya)', 'Pasar Pagar Dewa', 'Pasar Bejen (Kab. Karanganyar)', 'Pasar Remu', 'Pasar Anyar (Kota Tangerang)', 'Pasar Anyar (Kota Bogor)', 'Pasar Lakessi', 'Pasar Wonokromo', 'Pasar Bastiong', 'Pasar Anom', 'Pasar Cinde', 'Pasar Lapang', 'Pasar Pelantar Kud', 'Pasar Bintan Centre', 'Pasar Royal Lama', 'Pasar Badung', 'Pasar Sidodadi', 'Pasar Besar (Kota Malang)', 'Pasar Minggu (Kota Jakarta Selatan)', 'Pasar Sukoharjo', 'Pasar Anyar Martoloyo (Kota Tegal)', 'Pasar Cikurubuk', 'Pasar Legi (Kota Surakarta)', 'Pasar Dinoyo', 'Pasar Seroja', 'Pasar Aikmel', 'Pasar Bersehati', 'Pasar Wonoasih', 'Pasar Cileduk', 'Pasar Aviari', 'Pusat Pasar', 'Pasar Klaten Kota', 'Pasar Tambah Rejo', 'Pasar Horas', 'Pasar Sangkumpal Bonang', 'Pasar Lama Sentani', 'Pasar Tanjungpandan (Kab. Belitung)', 'Pasar Manis', 'Pasar Besar (Kota Madiun)', 'Pasar Petisah', 'Pasar Lemabang', 'Pasar Tos 3000 Jodoh', 'Pasar Pagi (Kota Samarinda)', 'Pasar Mundu', 'Pasar Inpres Lubuklinggau', 'Pasar Warung Jambu 2', 'Pasar Sentral (Kota Palopo)', 'Pasar Lama', 'Pasar Tua Biawu', 'Pasar Kiara Condong', 'Pasar Kranggan', 'Pasar Gede (Kota Surakarta)', 'Pasar Agro Politan', 'Pasar Liluwo', 'Pasar Peterongan', 'Pasar Banyuwangi', 'Pasar Weru', 'Pasar Sanggeng', 'Pasar Baru Sentani (Kab. Jayapura)', 'Pasar Panorama', 'Pasar Wage', 'Pasar Aek Habil', 'Pasar Karya Nugraha', 'Pasar Bajoe', 'Pasar Talang Banjar Jambi', 'Pasar Kreyongan', 'Pasar Sentral (Kota Gorontalo)', 'Pasar Agung', 'Pasar Terapung', 'Pasar Kota Lhokseumawe', 'Pasar Sukaramai (Kota Medan)', 'Pasar Induk Tj Selor', 'Pasar Dupa', 'Pasar Jungke (Kab. Karanganyar)', 'Pasar Klandasan', 'Pasar Tejo Agung 24', 'Pasar Nauli Sibolga', 'Pasar Pagi (Kota Pangkal Pinang)', 'Pasar Entrop Atau Hamadi', 'Pasar Pondok Gede (Kota Bekasi)', 'Pasar Sleko', 'Pasar Mandonga', 'Pasar Tingkat', 'Pasar Gudang', 'Pasar Mangli', 'Pasar Wonomulyo', 'Pasar Kramat', 'Pasar Kota', 'Pasar Labukkang', 'Pasar Anyar (Kab. Buleleng)', 'Pasar Bunder', 'Pasar Banyuasri', 'Pasar Segiri', 'Pasar Beringharjo', 'Pasar Flamboyan', 'Pasar Sunggingan (Kab. Boyolali)', 'Pasar Alok', 'Pasar Oeba', 'Pasar Mardika', 'Pasar Rawu', 'Pasar Gusher', 'Pasar Barukoto (Kota Bengkulu)', 'Pasar Angso Duo Jambi', 'Pasar Kahayan', 'Pasar Beringin', 'Pasar Merjosari', 'Pasar Arengka', 'Pasar Tenguyun', 'Pasar Sagulung', 'Pasar Tugu', 'Pasar Kuala Alianyang', 'Pasar Pusat Pembelanjaan Mentaya (ppm)', 'Pasar Kosambi', 'Pasar Kliwon', 'Pasar Subuh Sampit', 'Pasar Brayan', 'Pasar Pabaeng - Baeng', 'Pasar Pon', 'Pasar Siteba', 'Pasar Kreneng', 'Pasar Rogojampi', 'Pasar Kayu Jati', 'Pasar Dahlia', 'National Average', 'Pasar Dwikora', 'Pasar Hatta', 'Pasar Teratai', 'Pasar Ulee Kareng', 'Pasar Inpres Naikoten', 'Pasar Kelapa', 'Pasar Inpres', 'Pasar Kebon Roek', 'Pasar Singaparna', 'Pasar Kota Wonogiri', 'Pasar Kopindo', 'Pasar Bungur', 'Pasar Gemolong', 'Pasar Wameo', 'Pasar Kramatjati', 'Pasar Gotong Royong', 'Pasar Aksara', 'Pasar Senggol', 'Pasar Kanoman'],
"Djibouti": ['Tadjourah', 'Arta', 'Ali Sabieh', 'Dikhil', 'Obock'],
"Gambia": ['Bansang', 'Banjul', 'Wassu', 'Latri kunda', 'Farafenni', 'Brikamaba', 'Brikama', 'Bakau', 'Essau / Barra', 'Sibanor', 'Serrekunda', 'Sare Bojo', 'Fass Njaga Choi', 'Basse Santa su', 'Ker Pate Kore', 'Sare Ngai', 'Soma', 'Gunjur', 'Kwinella Nya Kunda', 'Jarreng', 'Kaur Wharf Town', 'Ndugu Kebbeh', 'Kuntaur', 'Kalagi', 'Fatoto', 'Lamin', 'Kerewan', 'Wellingara'],
"Guinea-Bissau": ['Bissau-Bairro Militar', 'Catio', 'Canchungo', 'Caravela', 'Fulacunda', 'Tite', 'Uno', 'Komo', 'Mercado Central-Bissau-Velho', 'Kirintim', 'Boe', 'Cacine', 'Bubaque', 'Contuboel', 'Bissau-Plack', 'Bissau-Bandim', 'Nhacra', 'Bula', 'Farim', 'Bedanda', 'Bissau-Caracol', 'Gabu', 'Empada', 'Quinhamel', 'Nhambane', 'Sonaco', 'Gamamudo', 'Pitche', 'Cruzamento', 'Safim', 'Bigene', 'Pirada', 'Cosse', 'Mansoa', 'Xitole', 'Bambadinca', 'Bissora', 'Quebo', 'Bolama', 'Cacheu', 'Prabis', 'Caio', 'Mansaba'],
"Afghanistan": ['Daykundi', 'Gardez', 'Faryab', 'Khost', 'Hirat', 'Bamyan', 'Hilmand', 'Laghman', 'Nuristan', 'Nili', 'Mazar', 'Farah', 'Ghor', 'Nangarhar', 'Sar-e-Pul', 'Takhar', 'Baghlan', 'Kabul', 'Jawzjan', 'Kunar', 'Paktika', 'Kunduz', 'Zabul', 'Maidan Wardak', 'Balkh', 'Samangan', 'Nimroz', 'Jalalabad', 'Logar', 'Kapisa', 'Paktya', 'Panjsher', 'Maymana', 'Uruzgan', 'Badghis', 'Kandahar', 'Ghazni', 'Badakhshan', 'Parwan', 'Fayzabad'],
"Democratic Republic of the Congo": ['Virunga', 'Kamina', 'Kamonia', 'Mosantu premier', 'Kamwesha', 'Nyiragongo', 'Lubumbashi', 'Bele', 'Butembo', 'Kisangani', 'Komanda', 'Bunkonde Centre', 'Mayimbi', 'Kajiji', 'Mweso', 'Nyanzale', 'Beni', 'Bipongo', 'Matadi', 'Bule', 'Pweto', 'Mashala', 'Luiza Centre', 'Tshikele', 'Bukavu', 'Dibumba', 'Pongo', 'Alanine', 'Mahagi', 'Banga Lubaka', 'Aba', 'Tshikapa', 'Kamako', 'Gbadolite', 'Birere', 'Katutu', 'Kabalo', 'Kindu', 'Kinshasa', 'Aru', 'Libenge', 'Mugunga3', 'Moba', 'Bunia', 'Kikwit', 'Kamalenga', 'Mambasa', 'Dungu', 'Mutena', 'Tshibamba', 'Boma', 'Goma', 'Largu', 'Boyabu', 'Kasongo Mule', 'Biringi', 'Mukoso', 'Mole', 'Mwene-Ditu', 'Ngwena gare', 'Likasi', 'Kolwezi', 'Mbuji-mayi', 'Kitule gare', 'Mbandaka', 'Tchomia', 'Kajiba', 'Kananga', 'Inke', 'Uvira', 'Mwetshi', 'Kahemba', 'Kasenyi', 'Kalemie', 'Zkele', 'Luebo', 'Isiro', 'Zongo', 'Bandundu ville', 'Ndjoko Punda'],
"Mongolia": ['Dornod', 'Ulaanbaatar', 'Selenge', 'Bayan-Ulgii', 'Uvurkhangai'],
"Lesotho": ['Mafeteng', 'Maseru', 'Butha Buthe', 'Berea', "Qacha's Nek", 'Leribe', "Mohale's Hoek", 'Mokhotlong', 'Quthing', 'Thaba Tseka'],
"Bolivia": ['Potosi', 'Cobija', 'Trinidad', 'Cochabamba', 'Sucre', 'Oruro', 'La Paz', 'Santa Cruz', 'Tarija'],
"Malawi": ['Nkhate', 'Golomoti', 'Mbonechela', 'Thete', 'Lilongwe', 'Zomba', 'Mpita', 'Area 23', 'Namwera', 'Chimbiya', 'Nambuma', 'Kambilonje', 'Migowi', 'Ulongwe', 'Songani', 'Nkhoma', 'Lizulu', 'Misuku', 'Karonga', 'Nsungwi', 'Limbuli', 'Euthin', 'Bembeke turn off', 'Chitakale', 'Manyamula', 'Bvumbwe', 'Lirangwe', 'Liwonde', 'Thekelani', 'Neno', 'Mangochi', 'Chilinga', 'Sorgin', 'Nsundwe', 'Thavite', 'Kamwendo', 'Kasungu', 'Nayuchi', 'Chintheche', 'Uliwa', 'Mitundu', 'Chitipa', 'Nthalire', 'Ntowe', 'Makanjila', 'Chinakanaka', 'Mkanda', 'Nkhotakota', 'Thyolo', 'Jali', 'Phalula', 'Nsikawanjala', 'Hewe', 'Kameme', 'Dzaleka', 'Ntchisi', 'Mwansambo', 'Chikweo', 'Muloza', 'Santhe', 'Embangweni', 'Mulomba', 'Mchinji', 'Chilumba', 'Dwangwa', 'Mzuzu', 'Mulanje', 'Mtakataka', 'Mpamba', 'Nkhatabay', 'Phalombe', 'Monkey Bay', 'Ntcheu', 'Mponela', 'Limbe', 'Kamsonga', 'Jenda', 'Luchenza', 'Bangula', 'Ngabu', 'Dyelatu', 'Nselema', 'Salima', 'Rumphi', 'Mangochi turn off', 'Kamuzu Road', 'Mangamba', 'Tomali', 'Mayaka', 'Dowa', 'Marka', 'Ntonda', 'Mwanza', 'Lunzu', 'Malomo', 'Mzimba', 'Nsanama', 'Ntaja', 'Chiradzulu', 'Waliranji', 'Madisi', 'Nanjiri', 'Nchalo', 'Kasiya', 'Sharpevaley', 'Mbela', 'Khuwi', 'Bolero', 'Chatoloma', 'Balaka', 'Nkhamenya', 'Chikhwawa', 'Chinamwali', 'Tsangano turn off', 'Nsanje', 'Thondwe'],
"Mozambique": ['Chokwe', 'Milange', 'Montepuez', 'Nhamatanda', 'Manica', 'Maputo', 'Nampula', 'Tete', 'Alto Molócuè', 'Pemba', 'Mutarara', 'Xai Xai', 'Chimoio', 'Mocuba', 'Gorongoza', 'Beira', 'Lichinga', 'Maxixe', 'Angónia', 'Cuamba', 'Massinga', 'Inhambane'],
"Niger": ['Dole', 'Wadata', 'Diffa Commune', 'Tanout', 'Arlit', 'Ingall', 'Petit Marche', 'Agadez Commune', 'Galmi', 'Guidiguir', 'Konni', 'Maradi Commune', 'Magaria', 'Abalak', 'Dungass'],
"Ethiopia": ['Hawzien', 'Nazareth', 'Alamata', 'Ajeber', 'Korem', 'Debark', 'Alaba', 'Assosa', 'Dekasuftu', 'Charati', 'Hossana', 'Arba Minch', 'Mersa', 'Gode', 'Dalocha', 'Babile', 'Kemise', 'Amaro', 'Hawassa', 'Shire', 'Shashemene', 'Dila', 'Masha', 'Aleta Wondo', 'Meti', 'Dalifagi', 'Wekro', 'Segno Gebeya', 'Mota', 'Kobo', 'Deder', 'Negele', 'Gubiya/yalo', 'Robe', 'Ginnir', 'Filtu', 'Awash arba', 'Abaala', 'Mekele', 'Adwa', 'Girawa', 'Wonago', 'Chifra', 'Gordamole', 'Harar', 'Diredawa', 'Enseno', 'Asayta', 'Ebinat', 'Addis Ababa', 'Moyale', 'Dessie', 'Harbu', 'Chiro', 'Derashe', 'Jijiga', 'Kersa', 'Beddenno', 'Sodo', 'Delo', 'Abomsa', 'Gambela', 'Haromaya', 'Bedessa', 'Dolo Ado', 'Abi Adi', 'Yabelo', 'Sawla', 'Aroresa', 'Sekota', 'Kowerneng/Korgang', 'Kebri Dehar', "Sik'ela", 'Adigrat', 'Punido', 'Mechara', 'Bati', 'Gohatsiyon/GebreGuracha'],
"Syrian Arab Republic": ['Hrak', 'Tell Abiad', 'Atareb', "Sheikh Sa'ad", 'Al Midan', 'Muhradah', 'Eastern Ghouta', 'Al Fiq', 'Duma', 'Hajar Aswad', 'Der Hafir', 'Jisr al shughur', 'Masyaf', 'Rafid', 'Al Balad', 'As-Suqaylabiyah', 'Bennsh', 'Aleppo', 'Moghambo', 'Hama', 'Maskanah', 'Ein Issa', 'Ekrema', 'Inshaat', 'Menbij', 'Homs', 'As-Sweida', 'Ar-Rastan', 'As-Safira', "Al-Cha'ar", 'Al Makhrim', 'Al Tabqah', 'Lattakia', 'Harem', 'Quamishli', 'Deir-ez-Zor', 'Al-Hasakeh', 'Khan Arnaba', "Dar'a", 'Mzeireb', 'Qudsiya', 'Al Bab', 'Shrebishat', 'Busra al Sham', 'Safita', 'Jandar', 'Sayda', "A'zaz", 'Kisweh', 'Tartous', 'Ein Terma', 'Hiffeh', 'Zablatani', 'Banias', 'Talbiseh', 'Hula', 'Jablah', 'Mashta Elhiu', 'Ar-Raqqa', 'Al Mayadin', "Izra'", 'Saqba', 'At-Tall', 'Jaramana', 'As-Sanamayn', "Dar'a (XB)", 'Hawash', 'Al Kom', 'Al Waer', 'Shahba', 'Nubul', 'As-Salamiyeh', 'Qaryatein', 'Nawa', 'Idleb', 'Afrin'],
"Cambodia": ['Samroang', 'Boeung Chhouk', 'Kralanh', 'Samaki', 'Thma Puok', 'Rovieng', 'Bat Doeng', 'Dang Tong', 'Ta Khmau', 'Bar Kaev', 'Thom Tmey', 'Prey Veng', 'Yeal Yon', 'Central Market (PST)', 'Kep', 'Serei Saophoan', 'Chong Kal', 'Stung Treng', 'Pha Oav', 'Kampong Thom', 'Kratie', 'Central Market (KSP)', 'Boeung Kuk', 'Krakor', 'Doun Keo', 'Phnom Srok', "S'ang", 'Kampong Chheuteal', 'Kampong Pranak', 'Anlong Veng', 'Kampong Speu', 'Saen Monourom', 'Svay Rieng', 'Tar khmao', 'Psa Leu', 'Kampong Chhnang', 'Kandal', 'Rattanak Kiri', 'Samrong', 'Thala Barivat', 'Kampot', 'Chbar Ampov', 'Koas Kralor', 'Mondol Kiri', 'Battambang', 'Stoung', 'Prey Totung', 'Chheu Kach', 'Chheu Tom', 'Siem Reap', 'Phnom Penh', 'Sala 5'],
"Sierra Leone": ['Pujehun', 'Port Loko', 'Kenema', 'Bo', 'Bonthe', 'Kono', 'Kailahun', 'Bombali', 'Moyamba', 'Tonkolili', 'Koinadugu', 'Freetown', 'Kambia'],
"Madagascar": ['Atsinanana (Region)', 'Vatovavy Fitovinany (Region)', 'Betsiboka (Region)', 'Menabe (Region)', 'Analamanga (Region)', 'Sofia (Region)', 'Androy (Region)', 'Atsimo Atsinanana (Region)', 'Ihorombe (Region)', 'Bongolava (Region)', 'Anosy (Region)', 'Atsimo Andrefana (Region)', 'Melaky (Region)', 'Sava (Region)', 'Haute Matsiatra (Region)', 'Analanjirofo (Region)', "Amoron'I Mania (Region)", 'Boeny (Region)', 'Diana (Region)', 'Vakinakaratra (Region)', 'Itasy (Region)', 'Alaotra Mangoro (Region)'],
"Tajikistan": ['Dushanbe', 'Gharm', 'Kulob', 'Isfara', 'Khatlon', 'Murghob', 'Khujand', 'Istaravshan', 'Sughd', 'Bokhtar', 'Khorog'],
"Argentina": ['Greater Buenos Aires'],
"Ghana": ['Bolga', 'Sekondi/Takoradi', 'Cape Coast', 'Wa', 'Garu', 'Mankessim', 'Obuasi', 'Yendi', 'Kintampo', 'Sunyani', 'Ho', 'Hohoe', 'Techiman', 'Tamale', 'Accra', 'Tema', 'Ejura', 'Koforidua', 'Kumasi'],
"Nigeria": ['Mubi', 'Nguru', 'Gujba (Buni Yadi)', 'Damaturu (Sunday Market)', 'Lagos', 'Bolori Stores', 'Maiduguri', 'Bullunkutu', 'Aba', 'Gulani (Tettaba)', 'Gwandu', 'Yusufari', 'Ibadan', 'Jakusko', 'Kaura Namoda', 'Giwa', 'Custom', 'Bade (Gashua)', 'Damaturu', 'Kusawam Shanu', 'Geidam', 'Monday', 'Saminaka', 'Potiskum', 'Gombe', 'Dandume', 'Tashan Bama', 'Baga Road', 'Budum', 'Yunusari', 'Dawanau', 'Biu', 'Abba Gamaram', 'Gujungu', 'Bursari'],
"Kazakhstan": ['Kostanay', 'Aktau', 'Almaty', 'Nur-Sultan'],
"Kenya": ['Kakuma 3', 'Dandora (Nairobi)', 'Mathare (Nairobi)', 'Dagahaley (Daadab)', 'Shonda (Mombasa)', 'Marigat town', 'Lodwar town', 'Isiolo town', 'Kalobeyei (Village 2)', 'Garissa town', 'Mukuru (Nairobi)', 'Kibra (Nairobi)', 'Mogadishu (Kakuma)', 'Junda (Mombasa)', 'Kakuma 2', 'Kalobeyei (Village 1)', 'Hagadera (Daadab)', 'Kawangware (Nairobi)', 'HongKong (Kakuma)', 'Kangemi (Nairobi)', 'Bangladesh (Mombasa)', 'Nairobi', 'Kalahari (Mombasa)', 'Kakuma 4', 'Kalobeyei (Village 3)', 'IFO (Daadab)', 'Ethiopia (Kakuma)'],
"South Sudan": ['Jau', 'Bunj', 'Konyokonyo', 'Kuajok', 'Yambio', 'Makpandu', 'Bor', 'Malakal', 'Rumbek', 'Wunrok', 'Kapoeta South', 'Aweil Town', 'Rubkona', 'Aniet', 'Torit', 'Melut', 'Suk Shabi', 'Yida', 'Minkaman', 'Bentiu'],
"Cameroon": ['Yaoundé-Mokolo', 'Fundong', 'Douala-Marché Central', 'Bamenda', 'Nkambe', 'Ndop', 'Buea', 'Wum', 'Bafoussam', 'Yaoundé-Marché 8e', 'Kumba', 'Limbé', 'Douala-Sandaga', 'Douala-Congo', 'Mamfé', 'Douala-Bonaberi', 'Kumbo', 'Yaoundé-Mfoundi'],
"Uganda": ['Namalu', 'Soroti', 'Owino', 'Masindi', 'Makaratin', 'Iganga', 'Jinja', 'Lira', 'Gulu', 'Kotido', 'Mbale', 'Karita', 'Kiboga', 'Kaabong', 'Mbarara', 'Kapchorwa'],
"Namibia": ['Windhoek', 'Keetmanshoop', 'Swakopmund', 'Gobabis', 'Otjiwarongo', 'Katima', 'Oshakati', 'Mariental'],
"Algeria": ['Samara', 'Boujdour', 'Tindouf', 'Layoun', 'Auserd', 'Algiers', 'Dakhla'],
"Nicaragua": ['Managua', 'National Average', 'National Average (excl. capital)'],
"Libya": ['Misrata', 'Ghadamis', 'Tajoura', 'Benghazi', 'Zliten', 'Bani Waleed', 'Ain Zara', 'Alkhums', 'Al Aziziya', 'Albayda', 'Ghiryan', 'Janzour', 'Msallata', 'Ashshgega', 'Wadi Etba', 'Tarhuna', 'Tripoli center', 'Abusliem', 'Brak', 'Zwara', 'Derna', 'Sabratha', 'Algatroun', 'Hai Alandalus', 'Azzawya', 'Murzuq', 'Ejdabia', 'Tobruk', 'Aljufra', 'Yefren', 'AlMarj', 'Azzintan', 'Ubari', 'Alkufra', 'Suq Aljumaa', 'Nalut', 'Ghat', 'Sebha', 'Sirt'],
"Guinea": ['Marché central (Labé)', 'Lola', 'Dibida (Kankan)', 'Boke', 'Kindia', 'Conakry-Madina', 'Beyla', 'Tanène', 'Mamou', 'Macenta', 'Faranah', 'Grand marché (Nzerekore)', 'Gueckedou', 'Koundara', 'Kissidougou'],
"Iraq": ['Erbil', 'Wasit', 'Kerbela', 'Maysan', 'Baghdad', 'Basrah', 'Muthanna', 'Salah al-deen', 'Thi-Qar', 'Diyala', 'Babylon', 'Dohuk', 'Sulaimaniyah', 'Anbar', 'Kirkuk', 'Najaf', 'Nainawa', 'Qadisiya'],
"Peru": ['Lima'],
"Somalia": ['Karaan', 'Eyl', 'Borama', 'Ceerigaabo', 'Jowhar', 'Dhuusamarreeb', 'Kismayo', 'Hargeysa', 'Qardho', 'Burco', 'Wadajir', 'Jariiban', 'Beletweyne', 'Xudur', 'Baidoa', 'Bossaso', 'Afmadow', 'Balcad', 'Afgooye', 'Owdweyne', 'Garowe', 'Buloburto', 'Gaalkacyo', 'Doolow'],
"Nepal": ['Mangalsen', 'Janakpurdham', 'Birgunj', 'Narayanghat', 'Rajbiraj', 'Musikot', 'Dhangadhi', 'Hetauda', 'Dhankuta', 'Phidim', 'Nepalgunj', 'Baglung', 'Simikot', 'Chainpur', 'Dunai', 'Pokhara', 'Kathmandu', 'Jumla Khalanga', 'Manthali', 'Biratnagar', 'Gamgadhi', 'Martadi', 'Bhairahawa', 'Birendranagar', 'Liwang'],
"Sudan": ['Port Sudan', 'Nyala', 'Al Fashir', 'Kosti', 'El Obeid', 'Eddein', 'Kadugli', 'Kassala', 'Damazin', 'El Geneina'],
"Chad": ['Abeche', 'Ngouri', 'Biltine', 'Bol'],
"Kyrgyzstan": ['At-Bashi', 'Sary-Kamysh', 'Chaek', 'Bishkek', 'Samarkandek', 'Tokmok', 'Bazar-Korgon', 'Naryn', 'Kaiyrma-Aryk', 'Uzgen', 'Kyzyl-Adyr', 'Arslanbob', 'Kara-Suu', 'Batken', 'Nookat', 'Jalal-Abad', 'Suzak', 'Dobolu', 'Toktogul', 'Bystrovka', 'Teplokluchenka', 'Kara-Balta', 'Osh', 'Karakol', 'National Average', 'Talas', 'Orto-Nura', 'Karabak', 'Kerben', 'Isfana', 'Kok-Say', 'Kyzyl-Tuu', 'Pokrovka', 'Balykchy'],
"United Republic of Tanzania": ['Simiyu Region', 'Njombe Region', 'Singida Region', 'Pwani Region', 'Kilimanjaro Region', 'Mtwara Region', 'Kagera Region', 'Shinyanga Region', 'Mbeya Region', 'Mwanza Region', 'Iringa Region', 'Manyara Region', 'Dar es Salaam Region', 'Mara Region', 'Arusha Region', 'Tabora Region', 'Morogoro Region', 'Tanga Region', 'Katavi Region', 'Dodoma Region', 'Geita Region', 'Ruvuma Region', 'Lindi Region', 'Songwe Region', 'Rukwa Region', 'Kigoma Region'],
"Ukraine": ['Kirovograd', 'Khmelnytsky', 'Kharkivka', 'Volyn', 'Dnipropetrovsk', 'Rivne', 'Herson', 'Odessa', 'Zaporizhia', 'Kiev', 'Zakarpattya', 'Chernihiv', 'Chernivtsi', 'Sums', 'Lviv', 'Mykolaiv', 'Cherkasy', 'Zhytomyr', 'Vinnitsa', 'Poltava', 'Donetska', 'National Average', 'Ivano-Frankivsk', 'Ternopil', 'm. Kyiv', 'Luhanska'],
"Mauritania": ['Zoueiratt', 'Twil', 'Rosso', 'Ould Yenge', 'Tentane', 'Wompou', 'Mederdra', 'Maghama', 'Djougountourou', 'Magta-lahjar', 'Moudjeria', 'Aoujeft', 'Kankossa', 'Nouadhibou', 'Vassala', 'Barkeol', 'Boghé', 'Aioun', 'Adel Bagrou', 'Ouadane', 'Aleg', 'Kaedi', 'Mbout', 'Tidjikja', 'Toufoundé-Civé', 'Kiffa', 'Atar', 'Nouakchott', 'Lexeiba1', 'Mbagne', 'Ndiago', 'Nema', 'Selibaby'],
"Haiti": ['Ouanaminthe', 'Hinche', 'Port-de-Paix', 'Cayes', 'Cap-Haitien', 'Jacmel', 'Gonaives', 'Jeremie', 'Port-au-Prince'],
"Congo": ['Sibiti', 'Nkayi', 'Monzombo', 'Grand marché/Fond Ntié-Ntié/Nkouikou', 'Moungali', 'Bakandi', 'Owando', 'Mikalou', 'Kinkala', 'Total', 'Ouenzé'],
"State of Palestine": ['Jenin', 'Gaza North', 'Nablus', 'Tulkarem', 'Hebron', 'Qalqiliya', 'Ramallah', 'Jericho', 'Bethlehem', 'Gaza', 'Rafah'],
"Pakistan": ['Quetta', 'Karachi', 'Lahore', 'Multan', 'Peshawar'],
"Eritrea": ['Asmara'],
"Armenia": ['Gyumri', 'Vagharshapat', 'Kapan', 'Ashtarak', 'Ijevan', 'Armavir', 'Yerevan', 'Gavar', 'Hrazdan', 'Berd', 'Vanadzor', 'Yeghegnadzor', 'Artashat'],
"Japan": ['Tokyo', 'Osaka'],
"Belarus": ['Minsk'],
"Lao People's Democratic Republic": ['Savannakhet', 'Huaphanh', 'Bokeo', 'Saravane', 'Khammouane', 'Luangnamtha', 'Xayabury', 'Sekong', 'Vientiane Province', 'Phongsaly', 'Vientiane Municipality', 'Oudomxay', 'Attapeu', 'Champassack', 'Xiengkhuang', 'Borikhamxay', 'Luang Prabang'],
"Swaziland": ['Hhohho', 'Lubombo', 'Shiselweni', 'National Average', 'Manzini'],
"Azerbaijan": ['National Average'],
"Turkey": ['Izmir', 'Ankara', 'National Average', 'Istanbul'],
"Panama": ['Panama'],
"Moldova Republic of": ['Chisinau', 'Causeni'],
"Sri Lanka": ['Economic Centre-Pettah', 'Economic Centre-Dambulla'],
"Guatemala": ['National Average'],
"Iran  (Islamic Republic of)": ['Tehran Market'],
"Angola": ['Luanda', 'Kaxinde'],
"Dominican Republic": ['Santo Domingo', 'National Average'],
"Egypt": ['National Average'],
"Bangladesh": ['Dhaka'],


		};
  
function val2(sel) {
  debugger
  const country = document.getElementById("countryPicker").value;
			const cityDropdown = document.getElementById("marketPicker");
			cityDropdown.innerHTML = "<option value=''>--Select City--</option>";
			if (country) {
				const cities = citiesByCountry[country];
				cities.forEach(city => {
					const option = document.createElement("option");
					option.value = city;
					option.text = city;
					cityDropdown.appendChild(option);
				});
			}
  
  $('#marketPicker').selectpicker('refresh');
  
  
  d3.select("svg").remove();
  d3.select("#MAIN").append("svg");
  var opt;
  opts2 = [];
  var len = sel.options.length;
  for (var i = 0; i < len; i++) {
    opt = sel.options[i];

    if (opt.selected) {
      opts2.push(opt.innerHTML);
    }
  }

  //setup("global_food_prices.csv", opts);
  setup(global_prices_csv, opts, opts2, opts3);
}

function val3(sel) {
  d3.select("svg").remove();
  d3.select("#MAIN").append("svg");
  var opt;
  opts3 = [];
  var len = sel.options.length;
  for (var i = 0; i < len; i++) {
    opt = sel.options[i];

    if (opt.selected) {
      opts3.push(opt.innerHTML);
    }
  }

  //setup("global_food_prices.csv", opts);
  setup(global_prices_csv, opts, opts2, opts3);
}