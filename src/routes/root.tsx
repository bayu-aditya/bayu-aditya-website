import { FC } from 'react'
import { Carousel } from 'react-responsive-carousel'
import { useWindowScroll, useWindowSize } from 'react-use'

import GithubIcon from '../assets/github-icon.svg'
import LinkedinIcon from '../assets/linkedin-icon.svg'
import MailIcon from '../assets/mail-icon.svg'
import BizhubImage1 from '../assets/projects/bizhub-1.webp'
import BizhubImage2 from '../assets/projects/bizhub-2.webp'
import BizhubImage3 from '../assets/projects/bizhub-3.webp'
import IdeatechImage1 from '../assets/projects/ideatech-1.webp'
import IdeatechImage2 from '../assets/projects/ideatech-2.webp'
import IdeatechImage3 from '../assets/projects/ideatech-3.webp'
import IdeatechImage4 from '../assets/projects/ideatech-4.webp'
import styles from './root.module.scss'

const isDev = import.meta.env.DEV

export default function Root() {
  return (
    <div>
      <AppBar />
      <About />
      <WorkingExperience />
      <Project />
      <Education />
    </div>
  )
}

const AppBar: FC = () => {
  const { y } = useWindowScroll()
  const { height } = useWindowSize()

  const opacity = y > height ? 1 : y / height
  const color = 255 - 255 * opacity

  return (
    <>
      {isDev && (
        <div
          className={styles.appbar}
          style={{
            backgroundColor: `rgba(255,255,255,${opacity})`,
            color: `rgb(${color},${color},${color})`,
          }}
        >
          <div>About</div>
          <div>Project</div>
          <div>Experience</div>
          <div>Education</div>
          <div>Contact Me</div>
        </div>
      )}
    </>
  )
}

const About: FC = () => {
  return (
    <div className={styles.about}>
      <div className="px-[100px] py-[50px] h-screen flex items-center">
        <div className="w-[65%]">
          <div className="flex flex-col gap-y-[10px]">
            <div className="font-bold text-[24px] text-[#FDFDFD]">
              Hello I'm
            </div>
            <div className="font-bold text-[48px] text-[#FEF4D0]">
              Bayu Aditya
            </div>
            <div className="text-[18px] text-[#FDFDFD] [&>p]:my-[5px]">
              <p>
                Currently as a Backend Software Engineer at Tokopedia, the
                largest eCommerce marketplace in the Indonesian region, with
                over 4 years of experience in Software Development.
              </p>
              <p>
                I am dedicated to continuous learning, not only in theoretical
                aspects but also in practical applications of Software
                Engineering and System Design Architecture.
              </p>
            </div>
          </div>
          <div className="flex gap-[30px] mt-[40px] h-[30px] [&>img]:cursor-pointer">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/bayu-aditya"
            >
              <img src={GithubIcon} />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.linkedin.com/in/bayu-aditya/"
            >
              <img src={LinkedinIcon} />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="mailto:contact@bayuaditya.dev"
            >
              <img src={MailIcon} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

const WorkingExperience: FC = () => {
  return (
    <div hidden={!isDev} className="bg-[#F3F3F3] text-black p-[100px]">
      <div className="text-center text-[36px] font-bold">
        Working Experience
      </div>
    </div>
  )
}

const Project: FC = () => {
  return (
    <div
      hidden={!isDev}
      className="flex flex-col gap-y-[100px] bg-[#E4E4E4] text-black p-[100px]"
    >
      <div className="text-center text-[36px] font-bold">Project</div>
      {dataProjects.map(proj => (
        <div
          key={proj.title}
          className="flex gap-[30px] grid-cols-[50%,50%] odd:flex-row-reverse"
        >
          <div className="flex flex-col gap-y-[20px]">
            <div>
              <div className="text-[24px] font-bold">{proj.title}</div>
              <div className="text-[20px]">{proj.subtitle}</div>
            </div>
            <div>{proj.desc}</div>
            <div className="flex gap-[10px] flex-wrap text-[14px]">
              {proj.stacks.map((stack, idx) => (
                <div
                  key={idx}
                  className="border border-black rounded-full px-[15px] py-[8px]"
                >
                  {stack}
                </div>
              ))}
            </div>
            <div className="flex gap-x-[10px]">
              <a
                href={proj.link}
                className="bg-[#4E4E4E] rounded-full w-min text-white whitespace-nowrap px-[20px] py-[9px]"
              >
                Visit Website
              </a>
              <a
                href={proj.linkDetail}
                className="bg-[#4E4E4E] rounded-full w-min text-white whitespace-nowrap px-[20px] py-[9px]"
              >
                See Details
              </a>
            </div>
          </div>

          <div>
            <Carousel width="650px" autoPlay infiniteLoop>
              {proj.images.map(image => (
                <img key={image} src={image} className="rounded-[5px]" />
              ))}
            </Carousel>
          </div>
        </div>
      ))}
    </div>
  )
}

const Education: FC = () => {
  return (
    <div hidden={!isDev} className="bg-[#F3F3F3] text-black p-[100px]">
      <div className="text-center text-[36px] font-bold">Education</div>
    </div>
  )
}

interface IProject {
  title: string
  subtitle: string
  desc: string
  stacks: string[]
  images: string[]
  link: string
  linkDetail: string
}

const dataProjects: IProject[] = [
  {
    title: 'Bizhub',
    subtitle: 'Kementerian Ketenagakerjaan',
    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
    stacks: [
      'Kubernetes',
      'Go',
      'React Typescript',
      'Next',
      'MySQL',
      'ElasticSearch',
      'RabbitMQ',
      'InfluxDB',
    ],
    images: [BizhubImage1, BizhubImage2, BizhubImage3],
    link: 'https://bizhub.kemnaker.go.id',
    linkDetail: '/',
  },
  {
    title: 'IdeaForm',
    subtitle: 'Ideatech',
    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
    stacks: [
      'Kubernetes',
      'Go',
      'React Typescript',
      'PostgreSQL',
      'NATS',
      'InfluxDB',
    ],
    images: [IdeatechImage1, IdeatechImage2, IdeatechImage3, IdeatechImage4],
    link: 'https://www.ideatech.id',
    linkDetail: '/',
  },
  {
    title: 'Monopoly Banking System',
    subtitle: 'Personal Website',
    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
    stacks: ['Kubernetes', 'Go', 'React Typescript', 'Vite', 'NATS'],
    images: [],
    link: '/monopoly-banking',
    linkDetail: '/',
  },
  {
    title:
      'Calculation of Electronic Structure in Materials using Tight Binding Method Undergraduate Thesis - University of Indonesia',
    subtitle: 'Undergraduate Thesis - University of Indonesia',
    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
    stacks: ['Python', 'Fortran', 'CUDA', 'OpenMPI'],
    images: [],
    link: '/monopoly-banking',
    linkDetail: '/',
  },
  {
    title: 'AI Engineer Internship Project',
    subtitle: 'Nodeflux',
    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
    stacks: ['Python', 'OpenCV'],
    images: [],
    link: '/monopoly-banking',
    linkDetail: '/',
  },
]
