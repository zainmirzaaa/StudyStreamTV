package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/rs/cors"
)

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	// Ensure the method is POST
	if r.Method != http.MethodPost {

		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Parse the incoming form data (for file uploads)
	err := r.ParseMultipartForm(10 << 20) // Limit upload size to 10 MB
	if err != nil {
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		return
	}
	// Get the file from the form data
	file, _, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Unable to get file", http.StatusBadRequest)
		return
	}
	defer file.Close()
	// Create a new file in the server's file system
	outFile, err := os.Create("uploaded_video.webm")
	if err != nil {
		http.Error(w, "Unable to create file", http.StatusInternalServerError)
		return
	}
	defer outFile.Close()

	// Copy the uploaded file to the new file
	_, err = outFile.ReadFrom(file)
	if err != nil {
		http.Error(w, "Error saving the file", http.StatusInternalServerError)
		return
	}

	// Respond with success
	fmt.Fprintf(w, "File uploaded successfully")
}

func main() {
	// Set up the routes
	http.HandleFunc("/upload", uploadHandler)

	// Set up CORS to allow all origins (for development purposes)
	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"*"}, // Allows all origins (use specific URLs in production)
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type"},
	})

	// Wrap the router with CORS middleware
	handler := corsHandler.Handler(http.DefaultServeMux)

	// Start the server
	log.Println("Starting server on :8080...")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
