import { AspectRatio, Card, Image, Text, Title } from '@mantine/core'
import { utcToZonedTime } from 'date-fns-tz'

export const TitleCard = (props: {
  title: string
  datetime: Date
  image: string
}) => {
  const zonedDate = utcToZonedTime(props.datetime, 'Asia/Tokyo')
  const date = zonedDate.toLocaleDateString()
  const time = zonedDate.toLocaleTimeString()
  const datetime = `${date} ${time}`
  return (
    <Card shadow={'md'}>
      <Card.Section>
        <AspectRatio ratio={16 / 9}>
          <Image src={props.image} />
        </AspectRatio>
      </Card.Section>
      <Title
        order={2}
        style={{
          fontSize: '130%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {props.title}
      </Title>
      <Text underline={false} align='right'>
        {datetime}
      </Text>
    </Card>
  )
}
