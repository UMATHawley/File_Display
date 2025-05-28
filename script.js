// Global variables
let selectedFile = null;

// DOM elements
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const fileDisplay = document.getElementById('fileDisplay');
const fileInputButton = document.querySelector('.file-input-button');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    console.log('File input element:', fileInput);
    console.log('Upload button element:', uploadBtn);
    
    // Event listeners
    fileInput.addEventListener('change', handleFileSelection);
    uploadBtn.addEventListener('click', handleUpload);
    
    // Add drag and drop functionality
    const uploadSection = document.querySelector('.upload-section');
    
    uploadSection.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadSection.style.transform = 'scale(1.02)';
        uploadSection.style.opacity = '0.9';
    });
    
    uploadSection.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadSection.style.transform = 'scale(1)';
        uploadSection.style.opacity = '1';
    });
    
    uploadSection.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadSection.style.transform = 'scale(1)';
        uploadSection.style.opacity = '1';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            // Simulate file input selection
            handleSingleFile(files[0]);
        }
    });
});

/**
 * Handle file selection from input
 */
function handleFileSelection(event) {
    console.log('File selection event triggered');
    const files = event.target.files;
    console.log('Files selected:', files.length);
    
    if (files.length > 0) {
        console.log('Processing file:', files[0].name);
        handleSingleFile(files[0]);
    } else {
        console.log('No files selected');
        resetSelection();
    }
}

/**
 * Handle a single file selection
 */
function handleSingleFile(file) {
    console.log('Handling single file:', file.name);
    selectedFile = file;
    
    // Update UI to show file is selected
    fileInputButton.classList.add('file-selected');
    fileInputButton.innerHTML = `✅ ${file.name}`;
    
    // Enable upload button
    console.log('Enabling upload button...');
    uploadBtn.disabled = false;
    uploadBtn.style.opacity = '1';
    uploadBtn.style.cursor = 'pointer';
    
    // Clear any previous display
    fileDisplay.innerHTML = '<p class="no-file">Click "Upload" to display file information</p>';
    
    console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
    console.log('Upload button disabled status:', uploadBtn.disabled);
}

/**
 * Reset file selection
 */
function resetSelection() {
    selectedFile = null;
    fileInputButton.classList.remove('file-selected');
    fileInputButton.innerHTML = '📁 Choose File';
    uploadBtn.disabled = true;
    uploadBtn.style.opacity = '0.5';
    uploadBtn.style.cursor = 'not-allowed';
    fileDisplay.innerHTML = '<p class="no-file">No file selected</p>';
}

/**
 * Handle upload button click
 */
function handleUpload() {
    if (!selectedFile) {
        alert('Please select a file first');
        return;
    }
    
    // Display file information
    displayFileInfo(selectedFile);
    
    // Add success message
    setTimeout(() => {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = '🎉 File uploaded successfully!';
        fileDisplay.appendChild(successMessage);
    }, 500);
    
    console.log('File uploaded:', selectedFile.name);
}

/**
 * Display file information
 */
function displayFileInfo(file) {
    const fileSize = formatFileSize(file.size);
    const fileType = file.type || 'Unknown';
    const lastModified = new Date(file.lastModified).toLocaleString();
    
    fileDisplay.innerHTML = `
        <div class="file-info">
            <div class="file-name">${escapeHtml(file.name)}</div>
            <div class="file-details">
                <span>📏 Size: ${fileSize}</span>
                <span>📄 Type: ${fileType}</span>
                <span>📅 Modified: ${lastModified}</span>
            </div>
        </div>
    `;
}

/**
 * Format file size in human readable format
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
