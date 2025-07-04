import { getRandomInterviewCover } from '@/lib/utils';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import DisplayTechIcons from './DisplayTechIcons';
import { Button } from './ui/button';
import { getFeedbackByInterviewId } from '@/lib/actions/general.action';

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;


  const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
  const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY');

  return (
    <div className='card-border w-[370px] max-sm:w-full min-h-96'>
      <div className='card-interview'>
        <div>
          <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-dark-400/80'>
            <p className='badge-text'>{normalizedType}</p>
          </div>
          <Image src={getRandomInterviewCover()} alt='cover-image' height={90} width={90} className='rounded-full object-fit' />
          <h3 className='mt-5 capitalize'>
            {role} Interview
          </h3>

          <div className='flex flex-row gap-5 mt-3'>
            <div className='flex flex-row gap-2'>
              <Image src="/calendar.svg" alt='calendar' width={22} height={22} />
              <p>{formattedDate}</p>
            </div>

            <div className='flex flex-row gap-2 items-center'>
              <Image src="/star.svg" alt='star' height={22} width={22} />
              <p>{feedback ?.totalScore || '---'}/100</p>
            </div>
          </div>
          <p className='line-clamp-2 mt-5'>
            {feedback?.finalAssessment || "You haven't taken the interview yet. Take it now to improve your skills."}
          </p>
        </div>
        <div className='flex flex-row justify-between'>
          <div className='flex gap-1'>
            <DisplayTechIcons techStack={techstack} />
          {techstack.length > 3 && techstack.length < 100 && (
            <p className="py-2.5 md:px-1 px-0.5 text-sm md:text-md hover:text-success-100 transition duration-300">
              +{techstack.length + Math.round(Math.random()*2)} more
            </p>
          )}

          </div>
          <Button className='btn-primary'>
            <Link href={
              feedback? `/interview/${interviewId}/feedback` : `interview/${interviewId}`
            }>
              {feedback ? 'Check Feedback' : 'Take Interview'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InterviewCard