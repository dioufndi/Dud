/*
Filter Info animation
 */

const filterOpenBtn = document.querySelector('.filter-open-btn')
const filterCloseBtn = document.querySelector('.filter-close-btn')
const filter = document.querySelectorAll('.filter')

filterIsOpen = false;

filterOpenBtn.addEventListener('click', () => {
    if (filterIsOpen)
    {
        filter.forEach(filter_el => filter_el.classList.remove('visible'));
        filterIsOpen = false;
    }
    else
    {
        filter.forEach(filter_el => filter_el.classList.add('visible'));
        filterIsOpen = true;
    }
})

filterCloseBtn.addEventListener('click', () => {
    filter.forEach(filter_el => filter_el.classList.remove('visible'))
})

/*
Data Cluster Info Close and Open
*/

const closeDataClusterBtns = document.querySelectorAll('.data-cluster-info-close-btn')
const dataCluster = document.querySelectorAll('.data-cluster-info')

closeDataClusterBtns.forEach(closeDataClusterBtn => closeDataClusterBtn.addEventListener('click', () => {
    dataCluster.forEach(dataCluster => dataCluster.classList.remove('visible'));
}));



/*
Data Point Info Close and Open
*/

const closeDataPointBtns = document.querySelectorAll('.data-point-info-close-btn')
const dataPoints = document.querySelectorAll('.data-point-info')

closeDataPointBtns.forEach(closeDataPointBtn => closeDataPointBtn.addEventListener('click', () => {
    dataPoints.forEach(dataPoint => dataPoint.classList.remove('visible'));
}));


/*
Bookmarks bar close and open
*/
let savedItemsBarIsOpen = false;
const savedItemsToggle = document.getElementById("toggle-saved-items-panel");
const savedItemsBar = document.getElementById("saved-items-bar");
const savedItemsCloseBtn = document.querySelector('.saved-items-close-btn')

savedItemsToggle.addEventListener("click", (e)=> {
    if (savedItemsBarIsOpen) {
        savedItemsBar.classList.remove("visible");
        savedItemsBarIsOpen = false;
    } else {
        document.querySelector(".data-point-info.job-info").classList.remove("visible");
        document.querySelector(".data-point-info.alumni-info").classList.remove("visible");
        document.querySelector(".data-cluster-info.job-info").classList.remove("visible");

        savedItemsBar.classList.add("visible");
        savedItemsBarIsOpen = true;
    }
});

savedItemsCloseBtn.addEventListener("click", (e) => {
    if (savedItemsBarIsOpen)
    {
        savedItemsBar.classList.remove("visible");
        savedItemsBarIsOpen = false;
    }
})