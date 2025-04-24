import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Skeleton } from "../../components/ui/skeleton"

export default function Component() {
  return (
    <div className="bg-[#D7D6D6] min-h-screen md:p-8 p-5">
      <div className="bg-white p-8 rounded-xl">
        <div className="mt-5 flex justify-between items-center w-full">
          <div className="w-[70%]">
            <Skeleton className="h-8 w-3/4" />
          </div>
          <div className="w-[30%] flex gap-x-3 items-center justify-end">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-x-3">
          <div className="min-h-screen w-full md:w-[75%] mt-8 flex flex-col bg-white rounded-xl">
            <section className="flex flex-col md:flex-row gap-3">
              <Card className="w-full md:w-[46%]">
                <CardHeader className="border-b">
                  <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
                </CardHeader>
                <CardContent className="flex mt-5 justify-center md:justify-start flex-wrap gap-3 gap-y-4 items-center">
                  <Skeleton className="h-[120px] w-[170px]" />
                  <Skeleton className="h-[120px] w-[200px]" />
                </CardContent>
              </Card>

              <Card className="w-full md:w-[54%]">
                <CardHeader className="flex border-b flex-row items-center justify-between">
                  <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
                  <Skeleton className="h-10 w-40" />
                </CardHeader>
                <CardContent className="grid gap-2 sm:grid-cols-1 mt-3 md:grid-cols-2 lg:grid-cols-3 w-full">
                  {[...Array(3)].map((_, index) => (
                    <Skeleton key={index} className="h-[110px] w-[160px]" />
                  ))}
                </CardContent>
              </Card>
            </section>

            <Card className="mt-5 w-full">
              <CardHeader className="border-b flex flex-row w-full justify-between items-center">
                <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
                <Skeleton className="h-10 w-60" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>

            <Card className="w-full mt-5">
              <CardHeader className="flex border-b flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
                <Skeleton className="h-10 w-24" />
              </CardHeader>
              <CardContent className="mt-3">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(3)].map((_, index) => (
                    <Card key={index} className="bg-white overflow-hidden relative">
                      <CardContent className="p-0">
                        <div className="p-4 pt-8">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2 mb-4" />
                          <Skeleton className="h-4 w-1/3 mb-4" />
                        </div>
                        <div className="bg-gray-50 p-4">
                          <Skeleton className="h-8 w-32" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-5">
              <CardHeader className="border-b">
                <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
              </CardHeader>
              <CardContent className="flex mt-5 mb-5 flex-wrap h-[350px] gap-3 gap-y-4 items-start w-full">
                <Skeleton className="h-full w-1/2" />
                <Skeleton className="h-full w-1/2" />
              </CardContent>
            </Card>

            <Card className="mt-5">
              <CardHeader className="flex border-b flex-row items-center justify-between">
                <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
                <Skeleton className="h-10 w-40" />
              </CardHeader>
              <CardContent className="flex mt-5 min-h-[400px] flex-wrap gap-3 gap-y-4 items-start w-full">
                <Skeleton className="h-full w-1/2" />
                <Skeleton className="h-full w-1/2" />
              </CardContent>
            </Card>

            <Card className="mt-5">
              <CardHeader className="border-b">
                <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
              </CardHeader>
              <CardContent className="flex mt-5 flex-wrap justify-center md:justify-start gap-3 gap-y-4 items-start w-full">
                {[...Array(7)].map((_, index) => (
                  <Skeleton key={index} className="w-[200px] h-[120px]" />
                ))}
              </CardContent>
            </Card>

            <Card className="mt-5">
              <CardHeader className="border-b">
                <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[400px] w-full" />
              </CardContent>
            </Card>
          </div>

          <div className="min-h-screen w-full mt-20 md:w-[25%]">
            <Skeleton className="h-[600px] w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}