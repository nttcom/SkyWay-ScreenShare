/// <reference path="typings/tsd.d.ts" />

module SkyWay {

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    export interface getUserMediaFirefoxOptionsObject {
        video: {
            mozMediaSource: string;
            mediaSource: string;
            width?: {
                min: number;
                max: number;
            };
            height?: {
                min: number;
                max: number;
            };
            frameRate?: {
                min: number;
                max: number;
            };
        };
        audio: boolean;
    }

    export interface getUserMediaChromeMandatoryObject {
        mandatory: {
            chromeMediaSource: string;
            chromeMediaSourceId: string;
            maxWidth?: number;
            maxHeight?: number;
            maxFrameRate?:number;
            minWidth?: number;
            minHeight?: number;
            minFrameRate?:number;
        };
        optional: any;
    }

    export interface gUMParamObject {
        Width?: number;
        Height?: number;
        FrameRate?: number;
    }

    export interface optionsObject {
        debug: boolean;
    }

    declare var window;

    export class ScreenShare {

        private _debug: boolean = false;

        constructor(options:optionsObject=null){
            if('debug' in options) this._debug = options.debug;
        }

        public startScreenShare(param:gUMParamObject,success:{(stream:MediaStream)}, error:{(error:Error)}, onEndedEvent = null):void{

            if(!!navigator.mozGetUserMedia) {

                // for FF
                var _paramFirefox: getUserMediaFirefoxOptionsObject = {
                    video: {
                        mozMediaSource: 'window',
                        mediaSource: 'window'
                    },
                    audio: false
                };

                if(isFinite(param.Width)) _paramFirefox.video.width = {min: param.Width,max: param.Width};
                if(isFinite(param.Height)) _paramFirefox.video.height = {min: param.Height,max: param.Height};
                if(isFinite(param.FrameRate)) _paramFirefox.video.frameRate = {min: param.FrameRate,max: param.FrameRate};

                this.logger(_paramFirefox);

                navigator.mozGetUserMedia(_paramFirefox, (stream)=>{
                    this.logger(stream);
                    success(stream);
                }, (err)=>{
                    this.logger(err);
                    error(err);
                });

            }else if(!!navigator.webkitGetUserMedia){

                // for Chrome
                var _paramChrome: getUserMediaChromeMandatoryObject = {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: ''
                    },
                    optional: [{
                        googTemporalLayeredScreencast: true
                    },{
                        googLeakyBucket: true
                    }]
                };

                if(isFinite(param.Width)) {
                    _paramChrome.mandatory.maxWidth = param.Width;
                    _paramChrome.mandatory.minWidth = param.Width;
                };
                if(isFinite(param.Height)) {
                    _paramChrome.mandatory.maxHeight = param.Height;
                    _paramChrome.mandatory.minHeight = param.Height;
                };
                if(isFinite(param.FrameRate)) {
                    _paramChrome.mandatory.maxFrameRate = param.FrameRate;
                    _paramChrome.mandatory.minFrameRate = param.FrameRate;
                };

                window.addEventListener('message',(event:MessageEvent)=>{
                    this.logger(event.data.type);
                    if(event.data.type != 'gotStreamId') {
                        return;
                    }
                    _paramChrome.mandatory.chromeMediaSourceId = event.data.streamid;
                    this.logger(_paramChrome);
                    navigator.getUserMedia({
                        audio: false,
                        video: _paramChrome
                    }, (stream)=>{
                        stream.onended = (event)=>{
                            this.logger(event);
                            if(typeof(onEndedEvent) !== "undefined") onEndedEvent();
                        };
                        this.logger(stream);
                        success(stream);
                    }, (err)=>{
                        this.logger(err);
                        error(err);
                    });

                });

                window.postMessage({type:"getStreamId"},"*");
            }

        }

        public stopScreenShare():boolean{
            // todo : It plans to implement
            return false;
        }

        public isEnabledExtension():boolean{
            this.logger(window.ScreenShareExtentionExists);
            if(typeof (window.ScreenShareExtentionExists) === 'boolean'){
                return true
            }else{
                return false
            }
        }

        private logger(message:any):void{
            if(this._debug){
                console.log("ScreenShare: "+message);
            }
        }

    }
}

