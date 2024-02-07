import GithubIcon from '../assets/github-icon.svg'
import LinkedinIcon from '../assets/linkedin-icon.svg'
import MailIcon from '../assets/mail-icon.svg'
import styles from './root.module.scss'

const isDev = import.meta.env.DEV

export default function Root() {
  return (
    <div>
      {/* App Bar */}
      {isDev && (
        <div className={styles.appbar}>
          <div>About</div>
          <div>Project</div>
          <div>Experience</div>
          <div>Education</div>
          <div>Contact Me</div>
        </div>
      )}

      {/* About */}
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

      {/* Working Experience */}
      <div hidden={!isDev} className="bg-[#F3F3F3] text-black p-[100px]">
        <div className="text-center text-[36px] font-bold">
          Working Experience
        </div>
      </div>

      {/* Project */}
      <div hidden={!isDev} className="bg-[#E4E4E4] text-black p-[100px]">
        <div className="text-center text-[36px] font-bold">Project</div>
      </div>
    </div>
  )
}
