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

func main() {
	router := gin.Default()
	router.GET("/quote/:sId/:epId/:qId", vidRequestHandler)
	router.Run("localhost:8080")
}

func trimVideo(qId int) {
	fmt.Println("Transcoding video...")
	ffmpeg.Input("./sample_data/india.mkv").Output("./subs.srt").OverWriteOutput().Run()
	subs, _ := gosrt.ReadFile("./subs.srt")
	sub := subs[qId]
	ffmpeg.Input("./sample_data/india.mkv", ffmpeg.KwArgs{"ss": sub.Start.Seconds() - 30}).Output(strconv.Itoa(qId)+".mp4", ffmpeg.KwArgs{"t": (sub.End - sub.Start).Seconds() + 60, "preset": "ultrafast", "c:v": "libx264", "crf": "30"}).OverWriteOutput().Run()
}

func vidRequestHandler(ctx *gin.Context) {
	quoteId, _ := strconv.Atoi(ctx.Param("qId"))
	quoteId -= 1
	fileName := strconv.Itoa(quoteId) + ".mp4"
	if _, err := os.Stat("./" + fileName); errors.Is(err, os.ErrNotExist) {
		trimVideo(quoteId)
	}
	ctx.Header("Content-Description", "File Transfer")
	ctx.Header("Content-Transfer-Encoding", "binary")
	ctx.Header("Content-Type", "video/mp4")
	ctx.Header("Cache-Control", "public, max-age=3600")
	ctx.File("./" + fileName)
}
