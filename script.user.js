// ==UserScript==
// @name         Image Scraper with Download Button for fancaps.net
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a download button under each image.
// @author       Maximax67
// @match        https://fancaps.net/*
// @grant        GM.xmlHttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Fuction to get image name
    function getStringAfterLastSlash(string) {
        const lastIndex = string.lastIndexOf('/');
        if (lastIndex !== -1) {
            return string.substring(lastIndex + 1);
        }

        return string;
    }

    // Function to create and add the download button
    function addDownloadButton(imageElement) {
        const downloadButton = document.createElement("a");
        const imageName = getStringAfterLastSlash(imageElement.src);
        const imageURL = "https://ancdn.fancaps.net/" + imageName; // Link to fullsize image

        downloadButton.innerHTML = "Download";
        downloadButton.style.fontSize = "16px";
        downloadButton.style.padding = "5px 16px";

        // Add event listener to download button
        downloadButton.addEventListener("click", function(event) {
            event.preventDefault();

            // Perform the request using GM.xmlHttpRequest
            GM.xmlHttpRequest({
                method: "GET",
                url: imageURL,
                responseType: "blob",
                onload: function(response) {
                    // Create a temporary link and trigger the download
                    var tempLink = document.createElement("a");
                    tempLink.href = window.URL.createObjectURL(response.response);
                    tempLink.download = imageName;
                    tempLink.click();
                }
            });
        });

        imageElement.parentNode.appendChild(downloadButton);
    }

    // Find all image elements within the specified HTML structure
    const imageElements = document.querySelectorAll(".row img");

    const hasAncestorWithClass = (element, className) => element.closest("." + className) !== null;

    // Loop through each image element and add the download button
    imageElements.forEach(function(imageElement) {
        // Exclude images within the right_bar div
        if (!hasAncestorWithClass(imageElement, "right_bar")) {
            addDownloadButton(imageElement);
        }
    });
})();
