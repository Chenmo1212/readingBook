gsap.registerPlugin(MorphSVGPlugin)

document.querySelectorAll('.bookmark').forEach(button => {
    button.addEventListener('pointerdown', e => {
        if(!button.classList.contains('marked')) {
            return
        }
        gsap.to(button.querySelectorAll('.default, .filled'), {
            morphSVG: 'M26 6H10V18C10 22.6863 11 28 11 28C11 28 17.5273 19.5 18 19.5C18.4727 19.5 25 28 25 28C25 28 26 22.6863 26 18V6Z',
            duration: .15
        })
    })
    button.addEventListener('click', e => {
        e.preventDefault()

        if(button.classList.contains('animated')) {
            return
        }
        button.classList.add('animated')

        if(button.classList.contains('marked')) {
            gsap.fromTo(button.querySelectorAll('.default, .filled'), {
                morphSVG: 'M26 6H10V18C10 22.6863 11 28 11 28C11 28 17.5273 19.5 18 19.5C18.4727 19.5 25 28 25 28C25 28 26 22.6863 26 18V6Z',
                duration: .15
            }, {
                keyframes: [ {
                    morphSVG: 'M26 6H10V18C10 22.6863 8 31 8 31C8 31 15.9746 26.5 18 23.5C20.0254 26.5 28 31 28 31C28 31 26 22.6863 26 18V6Z',
                    duration: .15
                }, {
                    morphSVG: 'M26 6H10V18V30C10 30 17.9746 23.5 18 23.5C18.0254 23.5 26 30 26 30V18V6Z',
                    duration: .6,
                    ease: 'elastic.out(1, .7)',
                    onComplete() {
                        button.classList.remove('marked', 'animated')
                    }
                }]
            })
            gsap.to(button, {
                '--default-position': '24px',
                duration: .2,
                clearProps: true
            })
            return
        }

        gsap.to(button, {
            '--background-height': '0px',
            duration: .125,
            delay: .3
        })
        gsap.to(button, {
            '--default-y': '-28px',
            duration: .4
        })
        gsap.to(button.querySelector('.corner'), {
            keyframes: [{
                morphSVG: 'M10 6C10 6 14.8758 6 18 6C21.1242 6 26 6 26 6C26 6 28 8.5 28 10H8C8 8.5 10 6 10 6Z',
                ease: 'none',
                duration: .125
            }, {
                morphSVG: 'M9.99999 6C9.99999 6 14.8758 6 18 6C21.1242 6 26 6 26 6C26 6 31 10.5 26 14H9.99999C4.99999 10.5 9.99999 6 9.99999 6Z',
                ease: 'none',
                duration: .15
            }, {
                morphSVG: 'M7.99998 16.5C7.99998 16.5 9.87579 22.5 18 22.5C26.1242 22.5 28 16.5 28 16.5C28 16.5 31 20 26 23.5H9.99998C4.99998 20 7.99998 16.5 7.99998 16.5Z',
                ease: 'power1.in',
                duration: .125,
                onComplete() {
                    gsap.set(button.querySelector('.corner'), {
                        fill: 'var(--color)',
                        delay: .05
                    })
                }
            }, {
                morphSVG: 'M8 28C8 28 12.8758 28.5 18 25.5C23.1242 28.5 28 27.5 28 27.5C28 27.5 26 24 26 23.5H10C10 25 8 28 8 28Z',
                ease: 'none',
                duration: .125
            }, {
                morphSVG: 'M10 30C10 30 17.8758 23.5 18 23.5C18.1242 23.5 26 30 26 30C26 30 26 23.5 26 23H10C10 24.5 10 30 10 30Z',
                ease: 'elastic.out(1, .7)',
                duration: .5,
                onComplete() {
                    button.classList.add('marked')
                    button.classList.remove('animated')
                    gsap.set(button, {
                        '--default-y': '0px',
                        '--default-position': '0px',
                        '--background-height': '19px'
                    })
                    gsap.set(button.querySelector('.corner'), {
                        morphSVG: 'M10 6C10 6 14.8758 6 18 6C21.1242 6 26 6 26 6C26 6 26 6 26 6H10C10 6 10 6 10 6Z',
                        clearProps: true
                    })
                }
            }]
        })
    })
})
