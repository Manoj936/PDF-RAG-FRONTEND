import React from 'react'

function AnimatedLoader() {
    return (
        <div className='min-h-screen  flex justify-center items-center'>
            <span className="relative flex size-30 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>

            </span>
        </div>
    )
}

export default AnimatedLoader