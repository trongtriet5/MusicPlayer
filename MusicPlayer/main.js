const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'Trongtriet5'

// ---------------------------------------------------- //
const heading = $('header h2')
const player = $('.player')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const progress = $('#progress')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [{
            name: "Hẹn Nhau Cuối Chân Trời",
            singer: "Lân Nhã",
            path: "/MusicPlayer/song/HenNhauCuoiChanTroi-LanNha-8246825.mp3",
            image: "/MusicPlayer/img/img.jpg"
        },
        {
            name: "Vệt Nắng",
            singer: "Lân Nhã",
            path: "/MusicPlayer/song/Vet Nang - Lan Nha.mp3",
            image: "/MusicPlayer/img/img.jpg"
        },
        {
            name: "Một Thưở Yêu Người",
            singer: "Lân Nhã",
            path: "/MusicPlayer/song/MotThuoYeuNguoi-LanNha-5663430.mp3",
            image: "/MusicPlayer/img/img.jpg"
        }, {
            name: "Lại Gần Hôn Anh",
            singer: "Lân Nhã",
            path: "/MusicPlayer/song/LaiGanHonAnh-LanNha-5262459.mp3",
            image: "/MusicPlayer/img/img.jpg"
        }, {
            name: "Đôi Bờ",
            singer: "Lân Nhã",
            path: "/MusicPlayer/song/DoiBoLiveCover-LanNha-6587948.mp3",
            image: "/MusicPlayer/img/img.jpg"
        }, {
            name: "Nhìn Lại Ký Ức",
            singer: "Lân Nhã",
            path: "/MusicPlayer/song/NhinLaiKyUcNguoiLangNgheOst-LanNha-7211194.mp3",
            image: "/MusicPlayer/img/img.jpg"
        }, {
            name: "Trái tim bên lề",
            singer: "Lân Nhã",
            path: "/MusicPlayer/song/TraiTimBenLe-LanNha-4821780.mp3",
            image: "/MusicPlayer/img/img.jpg"
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                    <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                    </div>
            `
        })
        $(".playlist").innerHTML = htmls.join("")
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })

    },
    handleEvent: function() {
        const _this = this
        const cdWidth = cd.offsetWidth
            // Xử lý CD xoay vòng / dừng
        const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()
            // Xử lý phóng to / thu nhỏ CD
        document.onscroll = () => {
                const scrollTop = window.scrollY || document.documentElement.scrollTop
                const cdNewWidth = cdWidth - scrollTop
                cd.style.width = cdNewWidth > 0 ? cdNewWidth + 'px' : 0
                cd.style.opacity = cdNewWidth / cdWidth
            }
            // Xử lý khi click nút play
        playBtn.onclick = () => {
                if (_this.isPlaying) {
                    audio.pause()
                } else {
                    audio.play()
                }
                // Khi nhạc được phát
                audio.onplay = () => {
                        _this.isPlaying = true
                        player.classList.add('playing')
                        cdThumbAnimate.play()
                    }
                    // Khi nhạc bị ngưng
                audio.onpause = () => {
                        _this.isPlaying = false
                        player.classList.remove('playing')
                        cdThumbAnimate.pause()
                    }
                    // Khi tiến độ bài nhạc thay đổi
                audio.ontimeupdate = () => {
                        if (audio.duration) {
                            const progressPercent = audio.currentTime / audio.duration * 100
                            progress.value = progressPercent
                        }
                    }
                    // Xử lý khi tua bài nhạc
                progress.oninput = (e) => {
                    const seekTime = (audio.duration * e.target.value / 100)
                    audio.currentTime = seekTime
                }
            }
            // Khi chuyển bài nhạc
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        prevBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong()
                } else {
                    _this.prevSong()
                }
                audio.play()
                _this.render()
                _this.scrollToActiveSong()

            }
            // Chuyển nhạc ngẫu nhiên
        randomBtn.onclick = function(e) {
                _this.isRandom = !_this.isRandom
                _this.setConfig('isRandom', _this.isRandom)
                randomBtn.classList.toggle('active', _this.isRandom)

            }
            // Xử lý audio khi audio ended
        audio.onended = function() {
                if (_this.isRepeat) {
                    audio.play()
                } else {
                    nextBtn.click()
                }
            }
            // Xử lý phát lại một bài nhạc
        repeatBtn.onclick = function(e) {
                _this.isRepeat = !_this.isRepeat
                _this.setConfig('isRepeat', _this.isRepeat)

                repeatBtn.classList.toggle('active', _this.isRepeat)
            }
            // Xử lý khi click vào bài nhạc trong playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                // Khi click vào bài nhạc
                if (songNode) {
                    // Khi get ra là chuỗi nên phải convert qua số để có thể render lại
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            })
        }, 200)
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image}`
        audio.src = this.currentSong.path
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig()
            // Định nghĩa các thuộc tính cho object
        this.defineProperties()
            // Lắng nghe / xử lý các sự kiện (DOM Events)
        this.handleEvent()
            // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()
            // Render playlist
        this.render();
    }
}
app.start()