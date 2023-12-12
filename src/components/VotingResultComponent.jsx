import { Card, CardBody, CardFooter, CardHeader, Divider, Flex, Heading, Progress, Skeleton, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function VotingResultComponent({ contract, changeStatus }) {
    const [candidates, setCandidates] = useState([]);
    const [votes, setVotes] = useState([]);
    const [votesSum, setVotesSum] = useState(0);

    const [isStarted, setStarted] = useState(false);
    const [isFinished, setFinished] = useState(false);

    const retrieveStatus = async () => {
        const started = await contract.methods.getVotingIsStarted().call();
        const finished = await contract.methods.getVotingIsFinished().call();

        setStarted(started);
        setFinished(finished);

        changeStatus(started, finished);
    }

    const retrievePartialResult = async () => {
        const result = await contract.methods.getPartialResult().call();
        const votesAsNumber = result[1].map(value => Number(value));

        setCandidates(result[0]);
        setVotes(votesAsNumber);
        calculateVotesSum();

        console.log(`Partial result successfully retrieved: candidates = ${result[0]} | votes = ${result[1]}`);
    }

    const retrieveFinalResult = async () => {
        const result = await contract.methods.getFinalResult().call();
        const votesAsNumber = result[1].map(value => Number(value));

        setCandidates(result[0]);
        setVotes(votesAsNumber);
        calculateVotesSum();

        console.log(`Final result successfully retrieved: candidates = ${result[0]} | votes = ${result[1]}`);
    }

    const calculateVotesSum = () => {
        const sum = votes.reduce((acc, current) => acc + current, 0);
        setVotesSum(sum);
    }

    const retrieveResult = async () => {
        if (isStarted && !isFinished) {
            await retrievePartialResult();
            console.log(`AAAAAAAAA ${votes} ${isStarted} ${isFinished}`)
        } else if (isStarted && isFinished) {
            await retrieveFinalResult();
            console.log(`BBBBBBBBB ${votes} ${isStarted} ${isFinished}`)
        }

    }

    useEffect(() => {
        retrieveStatus();
        retrieveResult();
        },
        [isStarted, isFinished]
    )

    return (
        <>
            <Heading as="h1" size="lg">Voting Results</Heading>

            <Divider my="15"/>

            <Flex minWidth="max-content" justifyContent="center" direction="column" gap="10">
                { isStarted ? (
                    candidates.map(
                        (address, index) => (
                            <Card>
                                <CardHeader>
                                    <Heading as="h4" size="md">{ address }</Heading>
                                </CardHeader>

                                <CardBody>
                                    <Text>{ votes[index] } votes</Text>
                                    <Progress hasStripe={!isFinished} isAnimated={!isFinished} value={votes[index] || 0} max={votesSum || 100} />
                                </CardBody>

                                <CardFooter>
                                </CardFooter>
                            </Card>
                        )
                    )
                ) : (
                    <Card>
                        <CardHeader>
                            <Skeleton height="20px">
                                <Heading as="h4" size="md">0x0000000000000000000000000000000000000000</Heading>
                            </Skeleton>
                        </CardHeader>

                        <CardBody align="center">
                            <Spinner size="xl" color="lightgray" mb="5"></Spinner>
                            <Text color="lightgray">Voting has not started yet...</Text>
                        </CardBody>
                    </Card>
                )}
            </Flex>

        </>
    );
}

export default VotingResultComponent;