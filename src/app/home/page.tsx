"use client"
import { Hero } from '@/components/routes/hero'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import React, { Component } from 'react'

export default class Home extends Component {
  render() {
    return (
        <div>
        <Hero />
          <section aria-labelledby="dashboard-preview" className="container mx-auto px-4 md:px-8 mt-10 md:mt-16 mb-16">
          <h2 id="dashboard-preview" className="sr-only">
            Dashboard preview
          </h2>
          <Card className="overflow-hidden border-neutral-200">
            <CardContent className="p-0">
              <div className="relative">
                <Image
                  src="/theApp.png"
                  alt="Preview of the Interview Helper AI dashboard showing sidebar navigation and a list of generated interview questions with AI-crafted answers."
                  width={1920}
                  height={1080}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </CardContent>
          </Card>
        </section>
        </div>
         
    )
  }
}
