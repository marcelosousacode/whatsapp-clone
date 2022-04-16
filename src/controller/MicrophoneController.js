import { ClassEvent } from "../util/classEvent";

export class MicrophoneController extends ClassEvent {

    constructor() {
        super();

        this._mimeType = 'audio/webm';

        this._available = false;

        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(stream => {
            this._available = true;
            this._stream = stream;
            this.trigger('ready', this._stream);

        }).catch(err => {

            console.error(err);

        });

    }

    isAvailable() {

        return this._available

    }

    stop() {

        if (this._available) {

            this._stream.getTracks().forEach(track => {

                track.stop();
    
            });
            this.trigger('stop');

        }
    }
    startRecorder() {

        if (this.isAvailable()) {

            this._mediaRecorder = new MediaRecorder(this._stream, {
                mimeType: this._mimeType
            });

            this._recordedChunks = [];

            this._mediaRecorder.addEventListener('dataavailable', e=> {

                if (e.data.size > 0) this._recordedChunks.push(e.data);

            });

            this._mediaRecorder.addEventListener('stop', e => {

                let blob = new Blob(this._recordedChunks, {
                    type: this._mimeType
                });

                let filename = `rec${Date.now()}.webm`;

                let file = new File([blob], filename, {
                    type:this._mimeType,
                    lastModified: Date.now()
                });
                console.log('file', file);

                
            });

            this._mediaRecorder.start();
        }

    }

    stopRecorder() {

        if (this.isAvailable()) {

            this._mediaRecorder.stop();
            this.stop();
        }

    }

}