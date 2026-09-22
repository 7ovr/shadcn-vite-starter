import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote:
      'We shipped a polished marketing site in a single afternoon. The blocks dropped in cleanly and looked right in both themes, exactly what our team needed.',
    name: 'Maya Chen',
    role: 'Founder',
    company: 'Northwind',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    quote:
      'The consistency is what sold us. Every section feels like it belongs together, so our product looks intentional everywhere we deploy it.',
    name: 'Daniel Okafor',
    role: 'Design Lead',
    company: 'Loopline',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    quote:
      'Accessible, sharp, and zero config. Our engineers stopped reinventing layouts and started shipping features again within days of adopting it.',
    name: 'Priya Nair',
    role: 'Engineering Manager',
    company: 'Vela',
    avatar: 'https://i.pravatar.cc/150?img=32',
  },
]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
}

export default function TestimonialsBlock() {
  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-20 text-foreground">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-block rounded-md border border-border px-3 py-1 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Testimonials
          </span>
          <h2 className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Loved by teams that ship
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Hear from the engineers, designers, and founders who build with Acme every day.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {testimonials.map(({ quote, name, role, company, avatar }) => (
            <Card
              key={name}
              className="flex flex-col gap-0 border-0 bg-card p-8 transition-colors duration-200 hover:bg-muted"
            >
              <CardContent className="flex flex-1 flex-col gap-5 p-0">
                <Quote className="size-8 text-foreground opacity-20" aria-hidden="true" />
                <blockquote className="flex-1 text-base leading-relaxed text-foreground">
                  &ldquo;{quote}&rdquo;
                </blockquote>
              </CardContent>

              <CardFooter className="mt-8 gap-4 border-t border-border px-0 pt-6 pb-8">
                <Avatar className="size-10 border border-border">
                  <AvatarImage src={avatar} alt={name} className="grayscale" />
                  <AvatarFallback className="text-xs font-semibold">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">{name}</span>
                  <span className="text-xs text-muted-foreground">
                    {role}, <span className="font-medium text-foreground">{company}</span>
                  </span>
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
