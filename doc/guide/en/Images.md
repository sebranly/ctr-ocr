# Images

Also available in: [French](../fr/Images.md)

## Introduction

The website is primarily an image-to-text tool that converts an image of results from a Crash Team Racing: Nitro Fueled race into text data representing those results. It's based on a technology called OCR that stands for Optimal Character Recognition. Thus, **it is important to provide high-quality images**, taken from the system directly (e.g. PlayStation system, Switch console, etc.) because it is based on a pattern of recognition.

## General information

### Formats

The website supports the following formats: `JPG`/`JPEG`/`PNG`.

### Dimensions

The website supports any dimensions as long as the **ratio of width/height is 1.78**. For example the following dimensions are supported: 3840x2160 (maximum allowed on PS5), 1280x720 (maximum allowed on Switch), etc.

### Names

If uploading multiple images, they will be sorted alphabetically by their name for the results. We advise you to name them with a common prefix and a different suffix number, for example as follows: `IMG1.JPG`, `IMG2.JPG`, ..., `IMG10.JPG` for an event containing 10 races. Please note that you can use different image formats for a same event e.g. `IMG1.JPG` vs `IMG2.PNG`.

An example with 10 races is available in this [example folder](https://github.com/sebranly/ctr-ocr/tree/main/src/img/examples/full-event).

## Platforms

### PS5

On PS5, screenshots can be taken in two formats: `JPG`/`PNG`. I noticed that `PNG` are way heavier (>10MB) than `JPG`/`JPEG` (<1MB) even though the dimensions are the same (3840x2160). They offer similar results so **I recommend simply using `JPG`/`JPEG`**.

|JPG|PNG|
|-|-|
|![](https://raw.githubusercontent.com/sebranly/ctr-ocr/main/src/img/examples/IMG1.JPG?raw=true)|![](https://raw.githubusercontent.com/sebranly/ctr-ocr/main/src/img/examples/IMG1.PNG?raw=true)|

Screenshots can be taken by pressing the Share button on the left part of the DualSense controller then hitting the button in the middle.

By using PS App on your mobile device, you can additionally set up an automatic upload of your screenshots from your PS5 to your PS App to save time. See this [Sony guide](https://www.playstation.com/en-ca/support/games/ps5-game-captures-ps-app/) for more information. Otherwise you can also share your screenshots to a Party or social media first.

### PS4

On PS4, screenshots can be taken in two formats: `JPG`/`PNG`. As explicitly mentioned on the PS4 UI, `PNG` are heavier and not always supported when being shared. I noticed this when sharing both through Party (then retrieving with PS App) and Twitter: the image format always becomes `JPG`.

Dimensions can be either 3840x2160 or 1920x1080.

Screenshots can be taken by holding the Share button (in Standard mode) on the left part of the DualShock 4 controller. I figured out it is the best way: due to differences between HDD (PS4) and SSD (PS5), the PS4 UI is a bit unresponsive for taking screenshots otherwise.

You can then share your screenshots to a Party or social media (e.g. Twitter). When I tested it, no matter the dimensions and format of the screenshot, it would be converted into a 1920x1080 `JPG` image.

**For all these reasons, I would recommend just setting up your PS4 to take 1920x1080 `JPG` screenshots directly.**

![](https://raw.githubusercontent.com/sebranly/ctr-ocr/main/src/img/examples/ps4/IMG_PS4.JPG?raw=true)

### Xbox

Follow this [Xbox guide](https://support.xbox.com/en-US/help/friends-social-activity/share-socialize/capture-game-clips-and-screenshots) in order to take screenshots on Xbox.

I don't own an Xbox so I do not have more information. If you do, please feel free to open a [GitHub issue](https://github.com/sebranly/ctr-ocr/issues) or a Pull Request to complete this section.

### Switch

On Switch, screenshots are taken in `JPG` format. Their dimensions are 1280x720.

Screenshots can be taken by pressing the Capture button located on the left Joy-Con.

You can then transfer those screenshots onto your computer or mobile device (Smart Device) by using one of these methods:
- [Nintendo guide for USB transfer](https://en-americas-support.nintendo.com/app/answers/detail/a_id/53664/~/how-to-transfer-screenshots-and-video-captures-to-a-computer-via-a-usb-cable)
- [Nintendo guide for Smart Device](https://www.nintendo.co.uk/Support/Nintendo-Switch/How-to-Transfer-Screenshots-and-Video-Captures-to-a-Smart-Device-Wirelessly-1886298.html)