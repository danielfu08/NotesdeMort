function playAudio(nomFitxer) {
            const ruta = `../assets/audios/audio_${nomFitxer}.mp3`;
            console.log(ruta);
            if (sound.components.sound && sound.components.sound.isPlaying) {
                sound.components.sound.stopSound();
            }
            sound.setAttribute('sound', `src: ${ruta}`);
            sound.components.sound.playSound();
        }
