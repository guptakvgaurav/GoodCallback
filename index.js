/**
 * Created by gaurav on 6/7/15.
 */


/**
 * Created by gaurav on 11/5/15.
 */

var eventCache = [];

var CACHE_SIZE = null;
var internals = {
    mCallback : null,
    bindTo: null
};

module.exports = internals.GoodCallback= function(events, config){
    internals.mCallback = config.mCallback;
    internals.bindTo = config.bindTo;
    CACHE_SIZE = config.cache_size || 3;
};

var onEmitterStopped = function(){
    // TODO: release occupied connection if any.
    internals.bindTo==null?
        internals.mCallback.apply(eventCache):
        internals.mCallback.call(internals.bindTo, eventCache);
    eventCache = null;
};

var provideCallback = function(chunk){
    if(eventCache.length >= CACHE_SIZE-1){
        // cache has reached the limit
        var tempStorage = eventCache;
        eventCache = [];
        internals.bindTo==null?
                internals.mCallback.apply(tempStorage):
                internals.mCallback.call(internals.bindTo, tempStorage);
    }else{
        eventCache.push(chunk);
    }
};

var onDataAvailable = function(chunk){
    console.log('Event: %s ', chunk.event);
    provideCallback(chunk);
};

internals.GoodCallback.prototype.init = function(readStream, emitter, callback){

    emitter.on('stop', onEmitterStopped);
    readStream.on('readable', function(){
        //console.log('There is something to read');
    });
    var boundedOnDataAvailable = onDataAvailable.bind(this);
    readStream.on('data', boundedOnDataAvailable);
    callback();
};

