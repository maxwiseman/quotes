package main

import (
	"errors"
	"fmt"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	gosrt "github.com/konifar/go-srt"
	ffmpeg "github.com/u2takey/ffmpeg-go"
	// "net/http"
)

const basePath = "/Volumes/NVME Drive/TV Shows/Top Gear (2002 - 2015)/"

func main() {
	router := gin.Default()
	router.GET("/quote/*path", vidRequestHandler)
	router.Run("localhost:8080")
}

func trimVideo(qId int, qIdx int, filePath string) {
	fmt.Println("Transcoding video...")
	ffmpeg.Input(basePath + filePath).Output("./subs.srt").OverWriteOutput().Run()
	subs, _ := gosrt.ReadFile("./subs.srt")
	sub := subs[qIdx]
	ffmpeg.Input(basePath+filePath, ffmpeg.KwArgs{"ss": sub.Start.Seconds() - 30}).Output("./cache/"+strconv.Itoa(qId)+".mp4", ffmpeg.KwArgs{"t": (sub.End - sub.Start).Seconds() + 60, "preset": "ultrafast", "c:v": "libx264", "crf": "30"}).OverWriteOutput().Run()
}

func vidRequestHandler(ctx *gin.Context) {
	if ctx.Query("secret") != "thisisasecret" {
		ctx.String(401, "401 - Not authorized")
		return
	}
	filePath := ctx.Params.ByName("path")
	println(filePath)
	quoteIndex, _ := strconv.Atoi(ctx.Query("qIdx"))
	quoteId, _ := strconv.Atoi(ctx.Query("qId"))
	quoteId -= 1
	cachedFileName := strconv.Itoa(quoteId) + ".mp4"
	if _, err := os.Stat("./cache/" + cachedFileName); errors.Is(err, os.ErrNotExist) {
		trimVideo(quoteId, quoteIndex, filePath)
	}
	ctx.Header("Content-Description", "File Transfer")
	ctx.Header("Content-Transfer-Encoding", "binary")
	ctx.Header("Content-Type", "video/mp4")
	ctx.Header("Cache-Control", "public, max-age=3600")
	ctx.File("./cache/" + cachedFileName)
}
