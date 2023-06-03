import jobData from '/geojson/jobs-full.geojson' assert {type: 'json'};
import alumniData from '/geojson/people.geojson' assert {type: 'json'};

mapboxgl.accessToken = 'pk.eyJ1IjoiZGlvdWZuZGkiLCJhIjoiY2w5bjMwMnc5MDJ4NzN4cGt0NTl0amcwOCJ9.Y3irDbXW1z6XHLnCtGodhQ';
const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/dioufndi/claiy83ay002b15qopswm5a6b',
    center: [-103.5917, 40.6699],
    zoom: 3
});
//------------------------------------------------------------------------------
map.on('load', () => {

    map.loadImage('/images/job-marker-icon.png', (err, image) => {
        if (err) throw err;
        map.addImage('job-marker-icon', image, { 'sdf': true });
    });

    map.loadImage('/images/alumni-marker-icon.png', (err, image) => {
        if (err) throw err;
        map.addImage('alumni-marker-icon', image, { 'sdf': true });
    });

    map.addSource('jobs', {
        type: 'geojson',
        data: jobData,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
    });

    map.addLayer({
        id: 'jobs-1',
        type: 'circle',
        source: 'jobs',
        filter: ['has', 'point_count'],
        layout: {
            'visibility': 'visible'
        },
        paint: {

            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#18453B',
                100,
                '#18453B',
                750,
                '#18453B'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
                40
            ],
        }
    });

    map.addLayer({
        id: 'jobs-2',
        type: 'symbol',
        source: 'jobs',
        filter: ['has', 'point_count'],
        layout: {
            'visibility': 'visible',
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        },
        paint: {
            "text-color": "#ffffff"
        }
    });

    map.addLayer({
        id: 'jobs-3',
        type: 'symbol',
        source: 'jobs',
        filter: ['!', ['has', 'point_count']],
        layout: {
            'visibility': 'visible',
            'icon-image': 'job-marker-icon',
            'icon-size': 0.2
        },
        paint: {
            'icon-color': '#18453B'
        }
    });

    //------------------------------------------------------------------------------
    map.addSource('alumni', {
        type: 'geojson',
        data: alumniData,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
    });

    map.addLayer({
        id: 'alumni-1',
        type: 'circle',
        source: 'alumni',
        filter: ['has', 'point_count'],
        layout: {
            'visibility': 'none'
        },
        paint: {
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#18453B',
                100,
                '#18453B',
                750,
                '#18453B'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
                40
            ],
        }
    });

    map.addLayer({
        id: 'alumni-2',
        type: 'symbol',
        source: 'alumni',
        filter: ['has', 'point_count'],
        layout: {
            'visibility': 'none',
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        },
        paint: {
            "text-color": "#ffffff"
        }
    });

    map.addLayer({
        id: 'alumni-3',
        type: 'symbol',
        source: 'alumni',
        filter: ['!', ['has', 'point_count']],
        layout: {
            'visibility': 'none',
            'icon-image': 'alumni-marker-icon',
            'icon-size': 0.2
        },
        paint: {
            'icon-color': '#18453B'
        }
    });

    //------------------------------------------------------------------------------
    function expandLayer(e, sourceName) {
        const features = map.queryRenderedFeatures(e.point, {
            layers: [sourceName == 'jobs' ? 'jobs-1' : 'alumni-1']
        });
        const clusterId = features[0].properties.cluster_id;
        const point_count = features[0].properties.point_count //Returns cluster count

        map.getSource(sourceName).getClusterLeaves(clusterId, point_count, 0, function (err, features) {
            // console.log(features);
            // Iterating through the feautures of clicked cluster
            document.querySelector(".data-cluster-info.job-info").classList.add("visible");
            document.querySelector(".data-point-info.job-info").classList.remove("visible");
            document.querySelector(".data-point-info.alumni-info").classList.remove("visible");
            document.getElementById("saved-items-bar").classList.remove("visible");

            let title;
            let employer
            let location
            var str = "<ul>"
            
            //Limits length to load large clusters efficiently 

            if (features.length > 50){
                features.length = 50
            }

            for (let i =0; i <= features.length - 1; i++) {

                title = features[i].properties.job_title;
                location = features[i].properties.location_name;
                
                if ("employer" in features[i].properties){
                    employer = features[i].properties.employer;
                }
                else{
                    employer = features[i].properties.current_company;
                }

                
                
                str += `<div id= "data-cluster-single">
                <h3>${title}</h3>
                <span>
                    <i class="fa-solid fa-building"></i>
                    <p>${employer}</p>
                </span>
                <span>
                    <i class="fa-solid fa-location-dot"></i>
                    <p>${location}</p>
                </span>
                <hr>
                </div>`
           
            
            str += "</ul>"
            
            document.getElementById("cluster-info-header").innerHTML = str

       

                //str += `<div> <button class= data-cluster-info-single> test </button> </div> <hr>`;
                // str += "<div>" + "<h3>" + title + "</h3>" + "<span>" + "<i class =" + "fa-solid fa-building" + "></i>" + "<p>" + employer + "</p>" +  "</span>" + "<span>" + "<i class =" + "fa-solid fa-building" + "></i>" + "<p>" + location + "</p>" +  "</span>" + "</div>" + "<hr>"
                // str += "<div>" + "<button class=" +  "data-cluster-info-single" + ">" + "<h3>" + title + "</h3>" + "<span>" + "<i class =" + "fa-solid fa-building" + "></i>" + "<p>" + employer + "</p>" +  "</span>" + "<span>" + "<i class =" + "fa-solid fa-building" + "></i>" + "<p>" + location + "</p>" +  "</span>"  + "</button>" + "</div>" + "<hr>"
                // str += "<div>" + "<button class=" +  "data-cluster-info-single" +">" + "test" +  "</button>" + "</div>" + "<hr>"

                //showSingleJobData(features[i])
                


                // document.querySelector("#cluster-info-header h3").innerText = title;
                // document.querySelector("#cluster-info-header p").innerText = employer;
                // document.querySelector("#cluster-info-location").innerText = location;
                
              }

         
        //<div id="cluster-info-header">
        //  <h3>Software Engineer Intern</h3>
        //  <span>
        //      <i class="fa-solid fa-building"></i>
        //      <p>Stark Industries</p>
        //  </span>
        //  <span>
        //      <i class="fa-solid fa-location-dot"></i>
        //      <p id="cluster-info-location">Manhattan, New York</p>
        //  </span>
        //</div>
        //<hr>


        });

        map.getSource(sourceName).getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
                if (err) return;

                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    }

    map.on('click', 'jobs-1', (e) => expandLayer(e, 'jobs'));
    map.on('click', 'alumni-1', (e) => expandLayer(e, 'alumni'));

    map.on('mouseenter', 'jobs-3', (e) => {
        // const id = e.features[0].properties.id

        const title = e.features[0].properties.job_title
        const coordinates = e.features[0].geometry.coordinates.slice();
        const employer = e.features[0].properties.employer
        const location = e.features[0].properties.location_name


        //const mag = e.features[0].properties.mag;
        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        const popupHTML = `<div class="popup-jobs">
                                <h4>${title}</h4>
                                <span>
                                    <i class="fa-solid fa-building"></i>
                                    <p>${employer}</p>
                                </span>
                                <span>
                                    <i class="fa-solid fa-location-dot"></i>
                                    <p>${location}</p>
                                </span>
                            </div>`

        currentPopup = new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupHTML)
            .addTo(map);

    });

    map.on('mouseenter', 'alumni-3', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const name = e.features[0].properties.name
        const photo = e.features[0].properties.photo_url
        const titleAndCompany = `${e.features[0].properties.job_title} @ ${e.features[0].properties.current_company}`;

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        const popupHTML = `<div class="popup-alumni-header">
                                <img class="popup-alumni-header-image" src="${photo}" alt="">
                                <div class="popup-alumni-header-details">
                                    <h4>${name}</h4>
                                    <p>${titleAndCompany}</p>
                                </div>
                            </div>`

        currentPopup = new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupHTML)
            .addTo(map);
    });

});

map.on('mouseleave', 'alumni-3', (e) => {
    if (currentPopup != null) {
        currentPopup.remove();
    }
})

map.on('mouseleave', 'jobs-3', (e) => {
    if (currentPopup != null) {
        currentPopup.remove();
    }
})

map.on('click', 'alumni-3', (e) => {
    showSingleAlumniData(e.features)
});

map.on('click', 'jobs-3', (e) => {
    showSingleJobData(e.features);
});


map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
});

let savedData = []
let currentData = undefined;


function showSingleAlumniData(alumniData) {
    //const id = alumniData[0].properties.id
    const name = alumniData[0].properties.name
    const photo = alumniData[0].properties.photo_url
    const location = alumniData[0].properties.location_name
    const job_title = alumniData[0].properties.job_title;
    const current_company = alumniData[0].properties.current_company;
    const history = alumniData[0].properties.education_history;

    document.querySelector("#alumni-name").innerText = name;
    document.querySelector("#alumni-header-image").src = photo;
    document.querySelector("#alumni-job-title p").innerText = job_title;
    document.querySelector("#alumni-current-company p").innerText = current_company;
    document.querySelector("#alumni-location p").innerText = location;

    if (arrayIncludesData(savedData, alumniData)) {
        document.querySelector("#save-alumni-button").innerHTML = '<i class="fa-regular fa-heart fa-solid"></i> Unsave';
    } else {
        document.querySelector("#save-alumni-button").innerHTML = '<i class="fa-regular fa-heart"></i> Save';
    }


    document.querySelector(".data-point-info.alumni-info").classList.add("visible");
    document.querySelector(".data-point-info.job-info").classList.remove("visible");
    document.querySelector(".data-cluster-info.job-info").classList.remove("visible");
    document.getElementById("saved-items-bar").classList.remove("visible");


    currentData = alumniData;
}

function showSingleJobData(jobData) {
    // const id = jobData[0].properties.id
    const title = jobData[0].properties.job_title;
    const employer = jobData[0].properties.employer;
    const location = jobData[0].properties.location_name;


    const jobType = jobData[0].properties.job_type;
    const employmentType = jobData[0].properties.employment_type;
    const inUS = jobData[0].properties.in_us;
    const hasSponsorships = jobData[0].properties.gives_sponsorships == "Yes" ? "Yes" : "No";
    const acceptsInternationalStudents = jobData[0].properties.accepts_internationals == "Yes" ? "Yes" : "No";

    document.querySelector("#job-info-header h3").innerText = title;
    document.querySelector("#job-info-header p").innerText = employer;
    document.querySelector("#job-info-location").innerText = location;

    document.querySelector("#job-type p").innerText = jobType;
    document.querySelector("#job-employment-type p").innerText = employmentType;
    document.querySelector("#job-in-us p").innerText = inUS;
    document.querySelector("#job-has-sponsorships p").innerText = hasSponsorships;
    document.querySelector("#job-accepts-international p").innerText = acceptsInternationalStudents;

    if (arrayIncludesData(savedData, jobData)) {
        document.querySelector("#save-job-button").innerHTML = '<i class="fa-regular fa-heart fa-solid"></i> Unsave';
    } else {
        document.querySelector("#save-job-button").innerHTML = '<i class="fa-regular fa-heart"></i> Save';
    }

    document.querySelector(".data-point-info.job-info").classList.add("visible");
    document.querySelector(".data-point-info.alumni-info").classList.remove("visible");
    document.querySelector(".data-cluster-info.job-info").classList.remove("visible");
    document.getElementById("saved-items-bar").classList.remove("visible");


    currentData = jobData;
}

let currentPopup = null;

const jobLayers = ['jobs-1', 'jobs-2', 'jobs-3']
const alumniLayers = ['alumni-1', 'alumni-2', 'alumni-3']

const dataToggleSlider = document.querySelector(".data-toggle-slider")
const alumniToggleButton = document.querySelector(".data-toggle-alumni")
const jobToggleButton = document.querySelector(".data-toggle-jobs")
const alumniFilterList = document.querySelector(".alumni-filter-list")
const jobFilterList = document.querySelector(".job-filter-list")
let isViewingAlumni = false;
dataToggleSlider.classList.add("data-toggle-slider-jobs");


alumniToggleButton.addEventListener('click', () => {
    if (!isViewingAlumni) {

        jobToggleButton.classList.remove("data-toggle-active");
        alumniToggleButton.classList.add("data-toggle-active");

        jobFilterList.classList.remove("filter-list-active")
        alumniFilterList.classList.add("filter-list-active")

        dataToggleSlider.classList.remove("data-toggle-slider-jobs");

        isViewingAlumni = true;

        jobLayers.forEach(layer => map.setLayoutProperty(layer, 'visibility', 'none'));
        alumniLayers.forEach(layer => map.setLayoutProperty(layer, 'visibility', 'visible'));

        document.querySelector(".data-point-info.alumni-info").classList.remove("visible");
        document.querySelector(".data-point-info.job-info").classList.remove("visible");
        document.querySelector(".data-cluster-info.job-info").classList.remove("visible");

        map.easeTo({
            center: [-103.5917, 40.6699],
            zoom: 3
        });

        document.querySelector(".data-source-display").innerText = `Viewing ${filteredAlumniData.features.length} Alumni`;
    }
})

jobToggleButton.addEventListener('click', () => {
    if (isViewingAlumni) {
        //Code below is supposed to remove any popups after switching tabs but doesn't work 
        // if (alumni_popup.isOpen()){
        //     alumni_popup.remove
        // }
        alumniToggleButton.classList.remove("data-toggle-active");
        jobToggleButton.classList.add("data-toggle-active");

        alumniFilterList.classList.remove("filter-list-active")
        jobFilterList.classList.add("filter-list-active")

        dataToggleSlider.classList.add("data-toggle-slider-jobs");

        isViewingAlumni = false;

        jobLayers.forEach(layer => map.setLayoutProperty(layer, 'visibility', 'visible'));
        alumniLayers.forEach(layer => map.setLayoutProperty(layer, 'visibility', 'none'));

        document.querySelector(".data-point-info.alumni-info").classList.remove("visible");
        document.querySelector(".data-point-info.job-info").classList.remove("visible");
        document.querySelector(".data-cluster-info.job-info").classList.remove("visible");

        map.easeTo({
            center: [-103.5917, 40.6699],
            zoom: 3
        });

        document.querySelector(".data-source-display").innerText = `Viewing ${filteredJobData.features.length} Jobs`;
    }
})


// Job Filtering
let filteredJobData = jobData;
if (!isViewingAlumni) document.querySelector(".data-source-display").innerText = `Viewing ${filteredJobData.features.length} Jobs`;
let jobDataSource = undefined;
map.on('sourcedata', (e) => {
    if (jobDataSource == undefined) {
        jobDataSource = map.getSource('jobs');
    }
});

const jobTitleFilter = document.getElementById("job-title-filter");
const jobEmployerFilter = document.getElementById("job-employer-filter");
const jobLocationFilter = document.getElementById("job-location-filter");
const jobTypeJobFilter = document.getElementById("job-type-job-filter");
const jobTypeInternshipFilter = document.getElementById("job-type-internship-filter");
const employmentFullTimeFilter = document.getElementById("employment-full-time-filter");
const employmentPartTimeFilter = document.getElementById("employment-part-time-filter");
const employmentInUSYesFilter = document.getElementById("employment-in-us-yes-filter");
const employmentInUSNoFilter = document.getElementById("employment-in-us-no-filter");
const acceptsInternationalsYesFilter = document.getElementById("accepts-internationals-yes-filter");
const acceptsInternationalsNoFilter = document.getElementById("accepts-internationals-no-filter");
const sponsorsInternationalsYesFilter = document.getElementById("sponsors-internationals-yes-filter");
const sponsorsInternationalsNoFilter = document.getElementById("sponsors-internationals-no-filter");


[jobTitleFilter, jobEmployerFilter, jobLocationFilter].forEach((attribute) => attribute.addEventListener('keyup', (e) => {
    let keyCode = e.code || e.key;
    if (keyCode === 13 || keyCode === 'Enter') {
        filterJobData();
    }
}));

const jobFilters = [
    employmentFullTimeFilter,
    employmentPartTimeFilter,
    jobTypeJobFilter,
    jobTypeInternshipFilter,
    employmentInUSYesFilter,
    employmentInUSNoFilter,
    acceptsInternationalsYesFilter,
    acceptsInternationalsNoFilter,
    sponsorsInternationalsYesFilter,
    sponsorsInternationalsNoFilter
];

jobFilters.forEach((attribute) => attribute.addEventListener('change', (e) => filterJobData()));

function filterJobData() {
    filteredJobData =
    {
        "type": "FeatureCollection",
        "crs": "FillerText",
        "features": jobData["features"].filter(job => {
            return filterByJobTitle(job) && filterByJobEmployer(job) && filterByJobLocation(job) && filterByJobType(job) && filterByEmploymentType(job) && filterByInUS(job) && filterByAcceptsInternationals(job) && filterBySponsorsInternationals(job);
        })
    }

    document.querySelector(".data-source-display").innerText = `Viewing ${filteredJobData.features.length} Jobs`;

    if (jobDataSource != undefined) jobDataSource.setData(filteredJobData);
}


function filterByJobTitle(job) {
    if (jobTitleFilter.value.length > 2) {
        if (!job.properties.job_title.toLowerCase().includes(jobTitleFilter.value.toLowerCase())) {
            return false;
        }
    }
    return true;
}

function filterByJobEmployer(job) {
    if (jobEmployerFilter.value.length > 2) {
        if (!job.properties.employer.toLowerCase().includes(jobEmployerFilter.value.toLowerCase())) {
            return false;
        }
    }
    return true;
}

function filterByJobLocation(job) {
    if (jobLocationFilter.value.length > 2) {
        if (!job.properties.location_name.toLowerCase().includes(jobLocationFilter.value.toLowerCase())) {
            return false;
        }
    }
    return true;
}

function filterByJobType(job) {
    if (jobTypeJobFilter.checked == jobTypeInternshipFilter.checked) {
        return true;
    }
    else {
        if (jobTypeJobFilter.checked && job.properties.job_type != "Job") {
            return false;
        }
        if (jobTypeInternshipFilter.checked && job.properties.job_type != "Internship") {
            return false;
        }
    }
    return true;
}

function filterByEmploymentType(job) {
    if (employmentFullTimeFilter.checked == employmentPartTimeFilter.checked) {
        return true;
    }
    else {
        if (employmentFullTimeFilter.checked && job.properties.employment_type != "Full-Time") {
            return false;
        }
        if (employmentPartTimeFilter.checked && job.properties.employment_type != "Part-Time") {
            return false;
        }
    }
    return true;
}

function filterByInUS(job) {
    if (employmentInUSYesFilter.checked == employmentInUSNoFilter.checked) {
        return true;
    }
    else {
        if (employmentInUSYesFilter.checked && job.properties.in_us != "Yes") {
            return false;
        }
        if (employmentInUSNoFilter.checked && job.properties.in_us != "") {
            return false;
        }
    }
    return true;
}

function filterByAcceptsInternationals(job) {
    if (acceptsInternationalsYesFilter.checked == acceptsInternationalsNoFilter.checked) {
        return true;
    }
    else {
        if (acceptsInternationalsYesFilter.checked && job.properties.accepts_internationals != "Yes") {
            return false;
        }
        if (acceptsInternationalsNoFilter.checked && job.properties.accepts_internationals != "") {
            return false;
        }
    }
    return true;
}

function filterBySponsorsInternationals(job) {
    if (sponsorsInternationalsYesFilter.checked == sponsorsInternationalsNoFilter.checked) {
        return true;
    }
    else {
        if (sponsorsInternationalsYesFilter.checked && job.properties.gives_sponsorships != "Yes") {
            return false;
        }
        if (sponsorsInternationalsNoFilter.checked && job.properties.gives_sponsorships != "") {
            return false;
        }
    }
    return true;
}




// Alumni Filtering
let filteredAlumniData = alumniData;
if (isViewingAlumni) document.querySelector(".data-source-display").innerText = `Viewing ${filteredAlumniData.features.length} Alumni`;
let alumniDataSource = undefined;
map.on('sourcedata', (e) => {
    if (alumniDataSource == undefined) {
        alumniDataSource = map.getSource('alumni');
    }
});

const alumniLocationFilter = document.getElementById("alumni-location-filter");
const alumniNameFilter = document.getElementById("alumni-name-filter");
const alumniJobTitleFilter = document.getElementById("alumni-job-title-filter");
const alumniEmployerFilter = document.getElementById("alumni-employer-filter");

[alumniLocationFilter, alumniNameFilter, alumniJobTitleFilter, alumniEmployerFilter].forEach((attribute) => attribute.addEventListener('keyup', (e) => {
    let keyCode = e.code || e.key;
    if (keyCode === 13 || keyCode === 'Enter') {
        filterAlumniData();
    }
}));

function filterAlumniData() {
    filteredAlumniData =
    {
        "type": "FeatureCollection",
        "crs": "FillerText",
        "features": alumniData["features"].filter(alumni => {
            return filterByAlumniName(alumni)
                && filterByAlumniEmployer(alumni)
                && filterByAlumniLocation(alumni)
                && filterByAlumniJobTitle(alumni);
        })
    }

    document.querySelector(".data-source-display").innerText = `Viewing ${filteredAlumniData.features.length} Alumni`;

    if (alumniDataSource != undefined) alumniDataSource.setData(filteredAlumniData);
}

function filterByAlumniJobTitle(alumni) {
    if (alumniJobTitleFilter.value.length > 2) {
        if (!alumni.properties.job_title.toLowerCase().includes(alumniJobTitleFilter.value.toLowerCase())) {
            return false;
        }
    }
    return true;
}

function filterByAlumniEmployer(alumni) {
    if (alumniEmployerFilter.value.length > 2) {
        if (!alumni.properties.current_company.toLowerCase().includes(alumniEmployerFilter.value.toLowerCase())) {
            return false;
        }
    }
    return true;
}

function filterByAlumniName(alumni) {
    if (alumniNameFilter.value.length > 1) {
        if (!alumni.properties.name.toLowerCase().includes(alumniNameFilter.value.toLowerCase())) {
            return false;
        }
    }
    return true;
}

function filterByAlumniLocation(alumni) {
    if (alumniLocationFilter.value.length > 2) {
        if (!alumni.properties.location_name.toLowerCase().includes(alumniLocationFilter.value.toLowerCase())) {
            return false;
        }
    }
    return true;
}

let resetFiltersBtn = document.querySelector(".reset-filters-button");
resetFiltersBtn.addEventListener("click", ()=> {
    [alumniLocationFilter, alumniNameFilter, alumniJobTitleFilter, alumniEmployerFilter].forEach((attribute) =>  {
        attribute.value = "";
    });

    filterAlumniData();

    
    [jobTitleFilter, jobEmployerFilter, jobLocationFilter].forEach((attribute) => {
        attribute.value = "";
    });
    [jobTypeJobFilter, jobTypeInternshipFilter, employmentFullTimeFilter, 
        employmentPartTimeFilter, employmentInUSYesFilter, employmentInUSNoFilter, 
        acceptsInternationalsYesFilter, acceptsInternationalsNoFilter, 
        sponsorsInternationalsYesFilter, sponsorsInternationalsNoFilter].forEach((attribute) => {
        attribute.checked = false;
    });

    filterJobData();
});

let saveJobBtn = document.getElementById("save-job-button");
let saveAlumniBtn = document.getElementById("save-alumni-button");
let clearSavedItems = document.querySelector(".clear-saved-items");

[saveJobBtn, saveAlumniBtn].forEach(btn => btn.addEventListener("click", (e)=> {
    if (arrayIncludesData(savedData, currentData)) {
        savedData = savedData.filter(data => !compareData(data, currentData));

        if (currentData[0].source == "jobs") {
            document.querySelector("#save-job-button").innerHTML = '<i class="fa-regular fa-heart"></i> Save';
        } else {
            document.querySelector("#save-alumni-button").innerHTML = '<i class="fa-regular fa-heart"></i> Save';
        }
        
    } else {
        savedData.push(currentData);

        if (currentData[0].source == "jobs") {
            document.querySelector("#save-job-button").innerHTML = '<i class="fa-regular fa-heart fa-solid"></i> Unsave';
        } else {
            document.querySelector("#save-alumni-button").innerHTML = '<i class="fa-regular fa-heart fa-solid"></i> Unsave';
        }
    }
    UpdateSavedData();
}));

function removeSavedItem(index) {
    let removedItem = savedData[index];
    savedData.splice(index, 1);

    if (removedItem[0].source == "jobs") {
        if (document.querySelector(".data-point-info.job-info.visible")) {
            document.querySelector("#save-job-button").innerHTML = '<i class="fa-regular fa-heart"></i> Save';
        }
    } else if (removedItem[0].source == "alumni") {
        if (document.querySelector(".data-point-info.alumni-info.visible")) {
            document.querySelector("#save-alumni-button").innerHTML = '<i class="fa-regular fa-heart"></i> Save';
        }
    }

    UpdateSavedData();
}

function UpdateSavedData() {
    let savedItemsList = document.querySelector(".saved-items-list");
    let savedItemsListReversed = [];
    savedItemsList.innerHTML = "";
    for (let i = 0; i < savedData.length; i++) {
        let li = document.createElement("li");

        let savedItem = savedData[i];

        if (savedItem[0].source == "jobs") {
            li.innerHTML = `<div class="saved-item">
            <div id="display-saved-job-${i}" class="saved-job">
                <h4>${savedItem[0].properties.job_title}</h4>
                <span>
                    <i class="fa-solid fa-building"></i>
                    <p>${savedItem[0].properties.employer}</p>
                </span>
                <span>
                    <i class="fa-solid fa-location-dot"></i>
                    <p>${savedItem[0].properties.location_name}</p>
                </span>
            </div>
            <button id="remove-saved-item-${i}" class="remove-saved-item-btn">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>`;
            
        } else {
            li.innerHTML = `<div class="saved-item">
            <div id="display-saved-alumni-${i}" class="saved-alumni">
                <img class="saved-alumni-image" src="${savedItem[0].properties.photo_url}" alt="">
                <div class="saved-alumni-details">
                    <h4>${savedItem[0].properties.name}</h4>
                    <p>${savedItem[0].properties.job_title} @ ${savedItem[0].properties.current_company}</p>
                </div>
            </div>
            <button id="remove-saved-item-${i}" class="remove-saved-item-btn">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>`;
        }

        savedItemsListReversed.push(li);
    }

    savedItemsListReversed = savedItemsListReversed.reverse();

    savedItemsListReversed.forEach(item => savedItemsList.appendChild(item));
    
    let removeBtns = document.querySelectorAll(".remove-saved-item-btn")
    removeBtns.forEach(btn => btn.addEventListener("click", (e) => {
        console.log(btn.id, btn.id.slice(18));
        removeSavedItem(parseInt(btn.id.slice(18)));
    }));

    if (savedItemsListReversed.length > 0) {
        clearSavedItems.style.display = "block";
    }
    else {
        clearSavedItems.style.display = "none";
    }
}

function compareData(data1, data2) {    // Returns true if the data are equal
    let data1props = data1[0].properties;
    let data2props = data2[0].properties;

    let data1keys = Object.keys(data1props);
    let data2keys = Object.keys(data2props);

    let equal = true;

    data1keys.forEach((key) => {
        if (!data2props.hasOwnProperty(key)) {
            equal = false;
        
        };
        if (data1props[key] != data2props[key]) {
            equal = false;
        }
    });

    data2keys.forEach((key) => {
        if (!data1props.hasOwnProperty(key)) {
            equal = false;
        }
        if (data2props[key] != data1props[key]) {
            equal = false;
        }
    });
    return equal;
}

function arrayIncludesData(arr, data) {
    let contains = false;
    arr.forEach((d) => {
        if (compareData(d, data)) {
            contains = true;
        }
    });

    return contains;
}

clearSavedItems.addEventListener("click", ()=>{

    while (savedData.length > 0) {
        removeSavedItem(0);
    }
    console.log(savedData);
});